import sqlite3 from "sqlite3";
import Database from "../../db/database.ts";
import ProgressEntity from "../entities/ProgressEntity.ts";
import type { CreateProgressDTO, UpdateProgressDTO } from "../dtos/ProgressDTOs.ts";

export default class ProgressRepository {

    public async create(progressData: CreateProgressDTO): Promise<ProgressEntity> {
        await using conn = await Database.getDatabase();

        // CORREÇÃO: Usamos 'await' para segurar a conexão aberta
        const result = await new Promise<ProgressEntity>((resolve, reject) => {
            const stmt = conn.db.prepare(
                "INSERT INTO Progresso (id_usuario, xp_total, nivel) VALUES (?, ?, ?)"
            );
            
            stmt.run(progressData.userId, 0, 1, function (this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    reject(err);
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

        return result;
    }

    public async findById(id: number): Promise<ProgressEntity | null> {
        await using conn = await Database.getDatabase();
        
        // CORREÇÃO: await aqui também
        const result = await new Promise<ProgressEntity | null>((resolve, reject) => {
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

        return result;
    }

    public async findByUserId(userId: number): Promise<ProgressEntity | null> {
        await using conn = await Database.getDatabase();

        // CORREÇÃO: await aqui também
        const result = await new Promise<ProgressEntity | null>((resolve, reject) => {
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

        return result;
    }

    public async update(id: number, data: UpdateProgressDTO): Promise<ProgressEntity | null> {
        console.log(`[DEBUG] Update iniciado para ID: ${id}`);
        
        // Agora o findById vai funcionar porque corrigimos ele acima
        const progress = await this.findById(id);
        if (!progress) {
            console.log(`[DEBUG] ID ${id} não encontrado.`);
            return null;
        }

        const newTotalXp = data.totalXp ?? progress.totalXp;
        const newLevel = data.level ?? progress.level;

        await using conn = await Database.getDatabase();
        
        // CORREÇÃO: await para garantir que o UPDATE termine antes de fechar
        await new Promise<void>((resolve, reject) => {
            conn.db.run(
                "UPDATE Progresso SET xp_total = ?, nivel = ? WHERE id_progresso = ?",
                [newTotalXp, newLevel, id],
                function (this: sqlite3.RunResult, err: Error | null) {
                    if (err) {
                        console.error(`[DEBUG] Erro SQL: ${err.message}`);
                        reject(err);
                    } else {
                        console.log(`[DEBUG] Linhas alteradas: ${this.changes}`);
                        resolve();
                    }
                }
            );
        });

        return ProgressEntity.create({
            id: id,
            userId: progress.userId,
            totalXp: newTotalXp,
            level: newLevel
        });
    }

    public async delete(id: number): Promise<boolean> {
        await using conn = await Database.getDatabase();
        
        const result = await new Promise<boolean>((resolve, reject) => {
            conn.db.run(
                "DELETE FROM Progresso WHERE id_progresso = ?",
                [id],
                function (this: sqlite3.RunResult, err: Error | null) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes > 0);
                    }
                }
            );
        });

        return result;
    }
}