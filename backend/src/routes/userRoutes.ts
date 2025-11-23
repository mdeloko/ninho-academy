import { Router } from "express";
import {
	createUser,
	deleteUser,
	getUserById,
	getUsers,
	login,
	updateUser,
} from "../controllers/userController.ts";
import { authMiddleware } from "../middlewares/auth.ts";

const userRoutes = Router();

userRoutes.post("/register", createUser);
userRoutes.post("/login", login);

userRoutes.get("/", authMiddleware, getUsers);
userRoutes.get("/:id", authMiddleware, getUserById);
userRoutes.put("/", authMiddleware, updateUser);
userRoutes.delete("/", authMiddleware, deleteUser);

export default userRoutes;
