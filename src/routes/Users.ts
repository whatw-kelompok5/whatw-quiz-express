import { Router } from "express";
import UserControllers from "../controllers/UserControllers";

const UserRouter = Router();

UserRouter.post("/register", UserControllers.register);
UserRouter.post("/login", UserControllers.login);
UserRouter.get("/users", UserControllers.find);

export default UserRouter;
