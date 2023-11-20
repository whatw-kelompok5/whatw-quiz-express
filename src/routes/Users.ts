import { Router } from "express";
import UserControllers from "../controllers/UserControllers";
import Auth from "../middlewares/Auth";

const UserRouter = Router();

UserRouter.post("/register", UserControllers.register);
UserRouter.post("/login", UserControllers.login);
UserRouter.get("/users", UserControllers.find);
UserRouter.patch("/user", Auth.authenticate, UserControllers.update);
UserRouter.get("/check", Auth.authenticate, UserControllers.check);

export default UserRouter;
