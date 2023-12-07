import { Request, Response } from "express";
import AvatarServices from "../services/AvatarServices";

export default new (class AvatarControllers {
	find(req: Request, res: Response) {
		AvatarServices.find(req, res);
	}
	create(req: Request, res: Response) {
		AvatarServices.create(req, res);
	}
	findById(req: Request, res: Response) {
		AvatarServices.findById(req, res);
	}
	delete(req: Request, res: Response) {
		AvatarServices.delete(req, res);
	}
	userFindAvatars(req: Request, res: Response) {
		AvatarServices.userFindAvatars(req, res);
	}
	userBuyAvatar(req: Request, res: Response) {
		AvatarServices.userBuyAvatar(req, res);
	}
})();
