import { Request, Response } from "express";
import UserServices from "../services/UserServices";

class UserControllers {
	register(req: Request, res: Response) {
		UserServices.register(req, res);
	}

	login(req: Request, res: Response) {
		UserServices.login(req, res);
	}

	find(req: Request, res: Response) {
		UserServices.find(req, res);
	}
}

export default new UserControllers();
