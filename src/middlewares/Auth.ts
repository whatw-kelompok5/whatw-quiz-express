import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export default new (class Auth {
	authenticate(req: Request, res: Response, next: NextFunction): Response {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const token = authorizationHeader.split(" ")[1];

		try {
			const loginSession = jwt.verify(token, "whatw-quiz");
			res.locals.loginSession = loginSession;
			next()
		} catch (error) {
			return res.status(401).json({error:"unauthorized"})
		}
	}
})();
