import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Diamond } from "../entity/Diamond";
import { User } from "../entity/User";
import { Request, Response } from "express";

export default new (class DiamondServices {
	private readonly diamondRepository: Repository<Diamond> =
		AppDataSource.getRepository(Diamond);

	private readonly userRepository: Repository<User> =
		AppDataSource.getRepository(User);

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
				throw new Error("User not found");
			}

			// Temukan diamond berdasarkan ID
			const diamond = await this.diamondRepository.findOne({
				where: { id: req.body.diamondId },
			});
			if (!diamond) {
				throw new Error("Diamond not found");
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
})();
