import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifytoken.middleware.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/getcurrentuser", verifyToken, getCurrentUser);
authRouter.get("/logout", logout);

export default authRouter;
