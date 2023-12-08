import { Request, Response } from "express";
import DiamondServices from "../services/DiamondServices";
class DiamondControllers {
	viewDiaomondPackage(req: Request, res: Response) {
		DiamondServices.viewDiaomondPackage(req, res);
	}
	buyDiamond(req: Request, res: Response) {
		DiamondServices.buyDiamond(req, res);
	}

	buyDiamondMidtrans(req: Request, res: Response) {
		DiamondServices.buyDiamondMidtrans(req, res);
	}
	midtransCallback(req: Request, res: Response) {
		DiamondServices.midtransCallback(req, res);
	}
}

export default new DiamondControllers();
