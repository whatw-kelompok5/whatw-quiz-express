import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Diamond } from "../entity/Diamond";
import { Request, Response } from "express";

export default new (class DiamondServices {
	private readonly diamondRepository: Repository<Diamond> =
		AppDataSource.getRepository(Diamond);

	async viewDiaomondPackage(req: Request, res: Response): Promise<Response> {
		const diamond = await this.diamondRepository.find();
		return res.status(200).json(diamond);
	}
})();
