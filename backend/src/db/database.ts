import sqlite3 from "sqlite3"
import {readFileSync,writeFileSync,existsSync} from "node:fs"

const cwd = process.cwd();
const sqliteVerbose = sqlite3.verbose();

const sqlScript = readFileSync(cwd + "/db/Query_BD_comp2.sql",{encoding:'utf-8'});
export const dbPath = cwd + "/db/banco.db";

export default class Database{
    public readonly db:sqlite3.Database;
    private readonly dbPath:string;

    private constructor(dbPath:string, dbInstance:sqlite3.Database){
        this.db = dbInstance;
        this.dbPath = dbPath;
    }

    public static async getDatabase():Promise<Database>{
        const dbInstance = await new Promise<sqlite3.Database>((resolve,reject)=>{
            const db = new sqliteVerbose.Database(dbPath, (err)=>{
                if(err){
                    console.error("❌ Erro ao conectar com banco:",err.message);
                    reject(err);
                }else{
                    console.log("✅ Sucesso: Conexão com banco criada!");
                    resolve(db);
                }
            });
        });
        return new Database(dbPath,dbInstance);
    }

    public static async initDatabase():Promise<void>{
        try{
            writeFileSync(dbPath,"");
            console.log("✅ Sucesso: Arquivo do Banco criado, prosseguindo para conexão e criação de tabelas...");
            await using dbInstance = await this.getDatabase()
            try{
                await dbInstance.db.exec(sqlScript)
                console.log("✅ Sucesso: Tabelas do Banco criadas."); 
            }catch(err){
                console.error("❌ Erro na criação do banco:",err);
            }
        }catch(err){
            throw new Error(`⚠️ Erro de Sistema de Arquivos: ${err instanceof Error? err.message : err}`);
        }
    }

    public async [Symbol.asyncDispose]():Promise<void>{
        console.log("⌛ Conexão utilizada, fechando...");

        return new Promise((resolve,reject)=>{
            this.db.close((err)=>{
                if(err){
                    console.error("❌ Erro ao fechar o banco: ", err.message);
                    reject(err)
                }else{
                    console.log("⚠️  Conexão com banco utilizada e fechada!")
                    resolve();
                }
            });
        });
    }
}