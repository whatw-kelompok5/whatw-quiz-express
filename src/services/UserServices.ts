import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createUserSchema } from "../utils/validator/Validate";
import * as jwt from "jsonwebtoken";
import { Avatar } from "../entity/Avatar";

class UserServices {
	private readonly UserRepository: Repository<User> =
		AppDataSource.getRepository(User);

	private readonly AvaRepository: Repository<Avatar> =
		AppDataSource.getRepository(Avatar);

	async register(req: Request, res: Response): Promise<Response> {
		try {
			const { fullname, email, avatar } = req.body;
			const { error, value } = createUserSchema.validate({
				fullname,
				email,
				avatar,
			});
			if (error) {
				return res.status(400).json({ error: error.details[0].message });
			}

			//? check Email
			const checkEmail = await this.UserRepository.count({
				where: {
					email: value.email,
				},
			});
			if (checkEmail > 0) {
				return res.status(400).json({ error, message: "Email already exist" });
			}

			const selectAvatar = await this.AvaRepository.findOneBy({
				id: value.avatar,
			});

			if (!selectAvatar) {
				return res.status(400).json({ error, message: "Avatar not found" });
			}

			const user = this.UserRepository.create({
				fullname: value.fullname,
				email: value.email,
				avatar: selectAvatar,
			});

			const createUser = await this.UserRepository.save(user);
			return res.status(200).json({ code: 200, data: createUser });
		} catch (error) {
			return res.status(400).json({ error });
		}
	}
	async login(req: Request, res: Response): Promise<Response> {
		try {
			const { fullname, email } = req.body;

			const userSelected = await this.UserRepository.findOne({
				where: {
					email: email,
				},
				relations: ["avatar"],
			});
			if (!userSelected) {
				return res.status(400).json({ error: "invalid user" });
			}

			const user = this.UserRepository.create({
				fullname: fullname,
				email: email,
			});

			const token = jwt.sign({ user }, "whatw-quiz", {
				expiresIn: "1d",
			});

			return res.status(200).json({
				code: 200,
				user: userSelected,
				token: token,
			});
		} catch (error) {
			return res.status(400).json({ error });
		}
	}
}

export default new UserServices();
