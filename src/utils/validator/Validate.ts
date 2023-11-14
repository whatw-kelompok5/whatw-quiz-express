import * as Joi from "joi";

export const createAvatarSchema = Joi.object({
	price: Joi.number().required(),
});
