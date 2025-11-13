import type { Request, Response } from "express";
import UserService from "../services/userService.ts";
import type { AuthRequest } from "../middlewares/auth.ts";
import {StatusCodes} from "http-status-codes"

const userService = new UserService();

export async function createUser(req: Request, res: Response) {
	try {
		const token = await userService.createUser(req.body);
		res.status(StatusCodes.CREATED).json({ token });
	} catch (error: any) {
		res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
	}
}

export async function login(req: Request, res: Response) {
	try {
		const token = await userService.login(req.body);
		if (!token) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Email ou senha inválidos" });
		}
		res.status(StatusCodes.ACCEPTED).json({ token });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
}

export async function getUsers(req: Request, res: Response) {
	try {
		const users = await userService.getUsers();
		res.status(StatusCodes.OK).json(users);
	} catch (error: any) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
	}
}

export async function getUserById(req: Request, res: Response) {
	try {
		const user = await userService.getUserById(Number(req.params.id));
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: "Usuário não encontrado" });
		}
		res.status(StatusCodes.OK).json(user);
	} catch (error: any) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
	}
}
/** 
* Essa função só atualiza o próprio usuário que a chama.
*/
export async function updateUser(req: AuthRequest, res: Response) {
	try {
		const id = req.user?.id;
		if (!id) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Não autorizado" });

		const user = await userService.updateUser(id, req.body);
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: "Usuário não encontrado" });
		}
		res.status(StatusCodes.OK).json(user);
	} catch (error: any) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
	}
}
/** 
* Essa função só deleta o próprio usuário que a chama.
*/
export async function deleteUser(req: AuthRequest, res: Response) {
    const date = new Date();
    console.log("DELETE de",req.ip,"em",date.toLocaleDateString(),"-",date.toLocaleTimeString())
	try {
        const id = req.user?.id;
		if (!id) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Não autorizado" });

		const success = await userService.deleteUser(id as number);
		if (!success) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: "Usuário não encontrado" });
		}
		res.status(StatusCodes.OK).send();
	} catch (error: any) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
	}
}
