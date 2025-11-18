import ProgressRepository from "../models/repositories/ProgressRepository.ts";
import type {
	CreateProgressDTO,
	UpdateProgressDTO,
} from "../models/dtos/ProgressDTOs.js";
import type ProgressEntity from "../models/entities/ProgressEntity.ts";

export default class ProgressService {
	private readonly progressRepository: ProgressRepository;

	constructor() {
		this.progressRepository = new ProgressRepository();
	}

	public async createProgress(
		progressData: CreateProgressDTO,
	): Promise<ProgressEntity> {
		try {
			const existingProgress = await this.progressRepository.findByUserId(
				progressData.userId,
			);
			if (existingProgress) {
				throw new Error("Progress for this user already exists");
			}
			return await this.progressRepository.create(progressData);
		} catch (error) {
			throw new Error(
				`Error creating progress: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			);
		}
	}

	public async getProgressById(id: number): Promise<ProgressEntity | null> {
		try {
			return await this.progressRepository.findById(id);
		} catch (error) {
			throw new Error(
				`Error finding progress: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			);
		}
	}

	public async getProgressByUserId(
		userId: number,
	): Promise<ProgressEntity | null> {
		try {
			return await this.progressRepository.findByUserId(userId);
		} catch (error) {
			throw new Error(
				`Error finding progress: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			);
		}
	}

	public async updateProgress(
		id: number,
		progressData: UpdateProgressDTO,
	): Promise<ProgressEntity | null> {
		try {
			return await this.progressRepository.update(id, progressData);
		} catch (error) {
			throw new Error(
				`Error updating progress: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			);
		}
	}

	public async deleteProgress(id: number): Promise<boolean> {
		try {
			return await this.progressRepository.delete(id);
		} catch (error) {
			throw new Error(
				`Error deleting progress: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			);
		}
	}
}
