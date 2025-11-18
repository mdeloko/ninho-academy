import sqlite3 from "sqlite3";
import Database from "../../db/database.ts";
import ProgressEntity from "../entities/ProgressEntity.ts";
import type { CreateProgressDTO, UpdateProgressDTO } from "../dtos/ProgressDTOs.ts";

export default class ProgressRepository {

    public async create(progressData: CreateProgressDTO): Promise<ProgressEntity> {
        await using conn = await Database.getDatabase();

        return new Promise((resolve, reject) => {
            const stmt = conn.db.prepare(
                "INSERT INTO Progresso (id_usuario, xp_total, nivel) VALUES (?, ?, ?)"
            );
            
            stmt.run(progressData.userId, 0, 1, function (this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(ProgressEntity.create({
                        id: this.lastID,
                        userId: progressData.userId,
                        totalXp: 0,
                        level: 1
                    }));
                }
                stmt.finalize();
            });
        });
    }

    public async findById(id: number): Promise<ProgressEntity | null> {
        await using conn = await Database.getDatabase();
        return new Promise((resolve, reject) => {
            conn.db.get("SELECT * FROM Progresso WHERE id_progresso = ?", [id], (err, row: any) => {
                if (err) {
                    reject(err);
                }
                if (!row) {
                    resolve(null);
                } else {
                    resolve(ProgressEntity.create({
                        id: row.id_progresso,
                        userId: row.id_usuario,
                        totalXp: row.xp_total,
                        level: row.nivel
                    }));
                }
            });
        });
    }

    public async findByUserId(userId: number): Promise<ProgressEntity | null> {
        await using conn = await Database.getDatabase();
        return new Promise((resolve, reject) => {
            conn.db.get("SELECT * FROM Progresso WHERE id_usuario = ?", [userId], (err, row: any) => {
                if (err) {
                    reject(err);
                }
                if (!row) {
                    resolve(null);
                } else {
                    resolve(ProgressEntity.create({
                        id: row.id_progresso,
                        userId: row.id_usuario,
                        totalXp: row.xp_total,
                        level: row.nivel
                    }));
                }
            });
        });
    }

    public async update(id: number, data: UpdateProgressDTO): Promise<ProgressEntity | null> {
        const progress = await this.findById(id);
        if (!progress) {
            return null;
        }

        const newTotalXp = data.totalXp ?? progress.totalXp;
        const newLevel = data.level ?? progress.level;

        await using conn = await Database.getDatabase();
        return new Promise(async (resolve, reject) => {
            await conn.db.run(
                "UPDATE Progresso SET xp_total = ?, nivel = ? WHERE id_progresso = ?",
                [newTotalXp, newLevel, id],
                async (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        const updatedProgress = await this.findById(id);
                        resolve(updatedProgress);
                    }
                }
            );
        });
    }

    public async delete(id: number): Promise<boolean> {
        await using conn = await Database.getDatabase();
        return new Promise(async (resolve, reject) => {
            await conn.db.run(
                "DELETE FROM Progresso WHERE id_progresso = ?",
                [id],
                function (this: sqlite3.RunResult, err: Error | null) {
                    if (err) {
                        reject(err.message);
                    }
                    resolve(this.changes > 0);
                }
            );
        });
    }
}

