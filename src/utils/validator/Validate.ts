import * as Joi from "joi";

export const createAvatarSchema = Joi.object({
	price: Joi.number().required(),
});
export const createUserSchema = Joi.object({
	fullname: Joi.string().required(),
	email: Joi.string().required(),
	avatar: Joi.number().required(),
});
