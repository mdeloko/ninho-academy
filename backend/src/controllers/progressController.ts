import type { Request, Response } from "express";
import ProgressService from "../services/progressService.ts";

const progressService = new ProgressService();

export const createProgress = async (req: Request, res: Response) => {
	try {
		const progress = await progressService.createProgress(req.body);
		res.status(201).json(progress);
	} catch (error) {
		res.status(500).json({
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const getProgressById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const progress = await progressService.getProgressById(Number(id));
		if (progress) {
			res.status(200).json(progress);
		} else {
			res.status(404).json({ message: "Progress not found" });
		}
	} catch (error) {
		res.status(500).json({
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const getProgressByUserId = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const progress = await progressService.getProgressByUserId(
			Number(userId),
		);
		if (progress) {
			res.status(200).json(progress);
		} else {
			res.status(404).json({
				message: "Progress not found for this user",
			});
		}
	} catch (error) {
		res.status(500).json({
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const updateProgress = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const progress = await progressService.updateProgress(
			Number(id),
			req.body,
		);
		if (progress) {
			res.status(200).json(progress);
		} else {
			res.status(404).json({ message: "Progress not found" });
		}
	} catch (error) {
		res.status(500).json({
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const deleteProgress = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const success = await progressService.deleteProgress(Number(id));
		if (success) {
			res.status(204).send();
		} else {
			res.status(404).json({ message: "Progress not found" });
		}
	} catch (error) {
		res.status(500).json({
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
