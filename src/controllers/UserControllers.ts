import { Request, Response } from "express";
import UserServices from "../services/UserServices";

class UserControllers {
	register(req: Request, res: Response) {
		UserServices.register(req, res);
	}
}

export default new UserControllers();
