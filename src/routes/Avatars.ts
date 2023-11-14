import { Router } from "express";
import AvatarControllers from "../controllers/AvatarControllers";
import uploadImage from "../middlewares/uploadImage";

const AvaRouter = Router();

AvaRouter.post(
	"/avatar",
	uploadImage.single("image"),
	AvatarControllers.create
);
AvaRouter.get("/avatars", AvatarControllers.find);

export default AvaRouter;
