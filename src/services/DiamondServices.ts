import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Diamond } from "../entity/Diamond";
import { User } from "../entity/User";
import { Request, Response } from "express";
// import { MidtransClient, Transaction } from "midtrans-client";
import * as midtransClient from "midtrans-client";

export default new (class DiamondServices {
	private readonly diamondRepository: Repository<Diamond> =
		AppDataSource.getRepository(Diamond);

	private readonly userRepository: Repository<User> =
		AppDataSource.getRepository(User);

	private midtransClient = new midtransClient.Snap({
		clientKey: "SB-Mid-client-2yxSDW9MSfHHPxRd",
		serverKey: "SB-Mid-server-3mi0pq2O0MesF3jHIStaVVTo",
		isProduction: false, // Set to true for the production environment
	});

	async viewDiaomondPackage(req: Request, res: Response): Promise<Response> {
		try {
			const diamond = await this.diamondRepository.find();
			return res.status(200).json(diamond);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	async buyDiamond(req: Request, res: Response): Promise<Response> {
		try {
			// Temukan user berdasarkan ID
			const user = await this.userRepository.findOne({
				where: { id: res.locals.loginSession.id },
			});
			if (!user) {
				return res
					.status(400)
					.json({ success: false, message: "User not found" });
			}

			// Temukan diamond berdasarkan ID
			const diamond = await this.diamondRepository.findOne({
				where: { id: req.body.diamondId },
			});
			if (!diamond) {
				return res
					.status(400)
					.json({ success: false, message: "Diamond Package not found" });
			}

			// Hitung total harga pembelian
			// const totalCost = user.diamond * diamond.price;

			// Update nilai diamond di tabel User
			user.diamond += diamond.quantity;
			await this.userRepository.save(user);

			// Kembalikan user setelah pembelian berhasil
			return res.status(200).json(user);
		} catch (error) {
			console.error("Error buying diamond:", error);
			return null;
		}
	}

	async buyDiamondMidtrans(req: Request, res: Response): Promise<Response> {
		try {
			const user = await this.userRepository.findOne({
				where: { id: res.locals.loginSession.id },
			});

			if (!user) {
				return res
					.status(400)
					.json({ success: false, message: "User not found" });
			}

			const diamond = await this.diamondRepository.findOne({
				where: { id: req.body.diamondId },
			});

			if (!diamond) {
				return res
					.status(400)
					.json({ success: false, message: "Diamond Package not found" });
			}

			// Create a Midtrans transaction
			const transactionDetails = {
				transaction_details: {
					order_id: `ORDER-${new Date().getTime()}`,
					gross_amount: diamond.price,
				},
				item_details: [
					{
						id: diamond.id.toString(),
						price: diamond.price,
						quantity: 1,
						name: "Diamond Package",
					},
				],
				customer_details: {
					email: user.email,
					full_name: user.fullname,
					phone: "YOUR_PHONE_NUMBER",
				},
				credit_card: {
					secure: true,
				},
			};

			const transactionToken = await this.midtransClient.createTransaction(
				transactionDetails
			);

			// Redirect the user to the Midtrans payment page
			return res
				.status(200)
				.json({ success: true, redirect_url: transactionToken.redirect_url });
		} catch (error) {
			console.error("Error buying diamond:", error);
			return res
				.status(500)
				.json({ success: false, message: "Internal server error" });
		}
	}
	async midtransCallback(req: Request, res: Response): Promise<Response> {
		try {
			// Handle Midtrans callback data
			const orderId = req.body.order_id;
			const transactionStatus = req.body.transaction_status;

			// Assuming orderId corresponds to your user's ID or a unique identifier
			const user = await this.userRepository.findOne({
				where: { id: orderId },
			});

			if (!user) {
				return res
					.status(400)
					.json({ success: false, message: "User not found" });
			}

			if (
				transactionStatus === "capture" ||
				transactionStatus === "settlement"
			) {
				// Transaction is successful, update the user's entity with the ordered diamond
				const orderedDiamond = req.body.transaction_details.gross_amount;
				user.diamond += orderedDiamond;
				await this.userRepository.save(user);

				return res
					.status(200)
					.json({ success: true, message: "Transaction successful" });
			} else if (transactionStatus === "deny") {
				// Transaction is denied, handle accordingly
				return res
					.status(200)
					.json({ success: false, message: "Transaction denied" });
			} else {
				// Transaction is in an unknown status, handle accordingly
				return res
					.status(200)
					.json({ success: false, message: "Unknown transaction status" });
			}
		} catch (error) {
			console.error("Error handling Midtrans callback:", error);
			return res
				.status(500)
				.json({ success: false, message: "Error handling callback" });
		}
	}
})();
