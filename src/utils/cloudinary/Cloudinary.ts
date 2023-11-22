import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = (
	file: Express.Multer.File
): Promise<string> => {
	cloudinary.config({
		cloud_name: "dtha7yn1x",
		api_key: "457796321727659",
		api_secret: "vZn0CbQhjz0OlgwaKQNnOHh_8ts",
	});

	return new Promise((resolve, reject) => {
		const opt = {
			folder: "whatw-quiz",
		};

		cloudinary.uploader.upload(file.path, opt, function (error, result) {
			if (error) {
				return reject(error);
			}
			return resolve(result.secure_url);
		});
	});
};
