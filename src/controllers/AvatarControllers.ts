import { Request, Response } from "express";
import AvatarServices from "../services/AvatarServices";

export default new (class AvatarControllers {
	find(req: Request, res: Response) {
		AvatarServices.find(req, res);
	}
	create(req: Request, res: Response) {
		AvatarServices.create(req, res);
	}
})();
