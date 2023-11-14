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
AvaRouter.get("/avatar/:id", AvatarControllers.findById);
AvaRouter.delete("/avatar/:id", AvatarControllers.delete);

export default AvaRouter;
