import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Diamond } from "../entity/Diamond";
import { User } from "../entity/User";
import { Transaction } from "../entity/Transaction";
import { Request, Response } from "express";
// import { MidtransClient, Transaction } from "midtrans-client";
import * as midtransClient from "midtrans-client";
import Env from "../utils/Env/Env";

export default new (class DiamondServices {
	private readonly diamondRepository: Repository<Diamond> =
		AppDataSource.getRepository(Diamond);

	private readonly userRepository: Repository<User> =
		AppDataSource.getRepository(User);

	private readonly transactionRepository: Repository<Transaction> =
		AppDataSource.getRepository(Transaction);

	private midtransClient = new midtransClient.Snap({
		clientKey: Env.MIDTRANS_CLIENT_KEY,
		serverKey: Env.MIDTRANS_SERVER_KEY,
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

			// Save transaction details to the database
			const newTransaction = this.transactionRepository.create({
				orderId: transactionDetails.transaction_details.order_id,
				email: user.email,
				diamond: diamond.quantity,
				price: diamond.price,
				transactionStatus: "pending",
			});
			await this.transactionRepository.save(newTransaction);

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
			const orderId = req.body.orderId;
			const transactionStatus = req.body.transactionStatus;

			// Find the corresponding transaction in the database
			const transaction = await this.transactionRepository.findOne({
				where: { orderId },
			});

			if (!transaction) {
				console.error("Transaction not found for orderId:", orderId);
				return res
					.status(404)
					.json({ success: false, message: "Transaction not found" });
			}

			// Update the transaction status
			transaction.transactionStatus = transactionStatus;

			// Save the updated transaction to the database
			await this.transactionRepository.save(transaction);

			// Check if the transaction was successful
			if (
				transactionStatus === "capture" ||
				transactionStatus === "settlement"
			) {
				const user = await this.userRepository.findOne({
					where: { email: transaction.email },
				});

				if (user) {
					user.diamond += transaction.diamond;
					await this.userRepository.save(user);
				} else {
					console.error("User not found for transaction:", transaction.id);
				}
			}

			return res
				.status(200)
				.json({ success: true, message: "Callback handled successfully" });
		} catch (error) {
			console.error("Error handling Midtrans callback:", error);
			return res
				.status(500)
				.json({ success: false, message: "Error handling callback" });
		}
	}
})();
