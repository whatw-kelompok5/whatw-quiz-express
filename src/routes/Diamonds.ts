import { Router } from "express";
import Auth from "../middlewares/Auth";
import DiamondControllers from "../controllers/DiamondControllers";

const DiaRouter = Router();

DiaRouter.get("/diamond", DiamondControllers.viewDiaomondPackage);

DiaRouter.patch(
	"/diamond/buy",
	Auth.authenticate,
	DiamondControllers.buyDiamond
);
DiaRouter.post("/diamond/callback", DiamondControllers.midtransCallback);
DiaRouter.post("/diamond/midtrans", Auth.authenticate, DiamondControllers.buyDiamondMidtrans);
export default DiaRouter;
