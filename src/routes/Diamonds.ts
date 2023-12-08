import { Router } from "express";
import Auth from "../middlewares/Auth";
import DiamondControllers from "../controllers/DiamondControllers";

const DiaRouter = Router();

DiaRouter.get("/diamond", DiamondControllers.viewDiaomondPackage);

DiaRouter.post(
	"/diamond/buy",
	Auth.authenticate,
	DiamondControllers.buyDiamond
);

export default DiaRouter;
