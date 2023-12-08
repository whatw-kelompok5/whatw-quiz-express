import { Request, Response } from "express";
import DiamondServices from "../services/DiamondServices";
class DiamondControllers {
	viewDiaomondPackage(req: Request, res: Response) {
		DiamondServices.viewDiaomondPackage(req, res);
	}
}

export default new DiamondControllers();
