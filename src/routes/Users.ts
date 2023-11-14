import { Router } from "express";
import UserControllers from "../controllers/UserControllers";

const UserRouter = Router();

UserRouter.post("/register", UserControllers.register);

export default UserRouter;
