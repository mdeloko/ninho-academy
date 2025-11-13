import Database from "../../db/database.ts";
import UserEntity from "../entities/UserEntity.ts";

export default class UserRepository {

    public async create(user: UserEntity): Promise<boolean> {
        await using conn = await Database.getDatabase();

        return new Promise(async (resolve, reject) => {
            await conn.db.run(
                "INSERT INTO Usuarios (nome, email, senha, data_nascimento) VALUES (?,?,?,?)",
                [user.name, user.email, user.password, user.birthDate],
                function (err) {
                    if (err) {
                        reject(err.message);
                    }
                    resolve(true);
                }
            )
        })
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        await using conn = await Database.getDatabase();
        return new Promise((resolve, reject) => {
            conn.db.get("SELECT * FROM Usuarios WHERE email = ?", [email], (err, row: any) => {
                if (err) {
                    reject(err);
                }
                if (!row) {
                    resolve(null);
                } else {
                    resolve(UserEntity.create(row.nome, row.senha, new Date(row.data_nascimento), row.email, row.id_usuario));
                }
            });
        });
    }

    public async findById(id: number): Promise<UserEntity | null> {
        await using conn = await Database.getDatabase();
        return new Promise((resolve, reject) => {
            conn.db.get("SELECT * FROM Usuarios WHERE id_usuario = ?", [id], (err, row: any) => {
                if (err) {
                    reject(err);
                }
                if (!row) {
                    resolve(null);
                } else {
                    resolve(UserEntity.create(row.nome, row.senha, new Date(row.data_nascimento), row.email, row.id_usuario));
                }
            });
        });
    }

    public async findAll(): Promise<UserEntity[]> {
        await using conn = await Database.getDatabase();
        return new Promise((resolve, reject) => {
            conn.db.all("SELECT * FROM Usuarios", (err, rows: any[]) => {
                if (err) {
                    reject(err);
                }
                resolve(rows.map(row => UserEntity.create(row.nome, row.senha, new Date(row.data_nascimento), row.email, row.id_usuario)));
            });
        });
    }

    public async update(user: UserEntity): Promise<boolean> {
        await using conn = await Database.getDatabase();
        return new Promise(async (resolve, reject) => {
            await conn.db.run(
                "UPDATE Usuarios SET nome = ?, email = ?, senha = ?, data_nascimento = ? WHERE id_usuario = ?",
                [user.name, user.email, user.password, user.birthDate, user.id],
                function (err) {
                    if (err) {
                        reject(err.message);
                    }
                    resolve(true);
                }
            );
        });
    }

    public async delete(id: number): Promise<boolean> {
        await using conn = await Database.getDatabase();
        return new Promise(async (resolve, reject) => {
            await conn.db.run(
                "DELETE FROM Usuarios WHERE id_usuario = ?",
                [id],
                function (err) {
                    console.log(this.lastID,this.changes)
                    if (err) {
                        reject(err.message);
                    }
                    resolve(true);
                }
            );
        });
    }
}