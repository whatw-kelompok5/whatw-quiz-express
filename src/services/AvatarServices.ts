import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Avatar } from "../entity/Avatar";
import { Request, Response } from "express";
import { createAvatarSchema } from "../utils/validator/Validate";
import { uploadToCloudinary } from "../utils/cloudinary/Cloudinary";
import { deleteFile } from "../utils/cloudinary/FileHelper";

export default new (class AvatarServices {
	private readonly AvaRepository: Repository<Avatar> =
		AppDataSource.getRepository(Avatar);

	async find(req: Request, res: Response): Promise<Response> {
		try {
			const avatar = await this.AvaRepository.find();

			return res.status(200).json(avatar);
		} catch (error) {
			return res.status(500).json(error);
		}
	}

	async findById(req: Request, res: Response): Promise<Response> {
		try {
			const avatar = await this.AvaRepository.findOneBy({
				id: parseInt(req.params.id),
			});
			return res.status(200).json(avatar);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	async create(req: Request, res: Response): Promise<Response> {
		try {
			const data = req.body;

			const { error, value } = createAvatarSchema.validate(data);
			if (error) {
				return res.status(400).json({ error: error.details[0].message });
			}
			let image = "";
			if (req.file?.filename) {
				image = await uploadToCloudinary(req.file);

				deleteFile(req.file.path);
			}
			console.log(value);

			const avatar = this.AvaRepository.create({
				image: image,
				price: value.price,
			});
			const createAva = await this.AvaRepository.save(avatar);
			return res.status(200).json(createAva);
		} catch (error) {
			return res.status(500).json(error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response> {
		try {
			const avatar = await this.AvaRepository.delete({
				id: parseInt(req.params.id),
			});
			return res.status(200).json(avatar);
		} catch (error) {
			return res.status(500).json(error);
		}
	}

	async userFindAvatars(req: Request, res: Response): Promise<Response> {
		try {
			const avatars: Avatar[] = await this.AvaRepository.find({
				order: {
					id: "ASC",
				},
				relations: ["avatar_owners"],
				select: {
					avatar_owners: {
						id: true,
						fullname: true,
						email: true,
					},
				},
			});
			return res.status(200).json({
				code: 200,
				status: "succes",
				data: avatars.map((avatar) => {
					let owned = false;

					if (avatar.price === 0) {
						owned = true;
					} else {
						owned = Boolean(
							avatar.avatar_owners.filter(
								(owner) => owner.id === res.locals.loginSession.id
							).length
						);
					}
					return {
						id: avatar.id,
						image: avatar.image,
						price: avatar.price,
						owned,
					};
				}),
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	}
})();
