import { Router } from "express";
import AvatarControllers from "../controllers/AvatarControllers";
import uploadImage from "../middlewares/uploadImage";
import Auth from "../middlewares/Auth";

const AvaRouter = Router();

AvaRouter.post(
	"/avatar",
	uploadImage.single("image"),
	AvatarControllers.create
);
AvaRouter.get("/avatars", AvatarControllers.find);
AvaRouter.get("/avatar/:id", AvatarControllers.findById);
AvaRouter.delete("/avatar/:id", AvatarControllers.delete);
AvaRouter.get(
	"/user/avatars",
	Auth.authenticate,
	AvatarControllers.userFindAvatars
);

export default AvaRouter;
