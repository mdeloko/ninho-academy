import express from "express";
import {testRouter} from "./routes/test.ts"
import userRoutes from "./routes/userRoutes.ts"
import progressRoutes from "./routes/progressRoutes.ts";
import Database, {dbPath} from "./db/database.ts";
import { existsSync } from "node:fs";

const serverPort = process.env.PORT;
const server = express();

server.use(express.json())
server.use("/test",testRouter)
server.use("/users",userRoutes)
server.use("/progress", progressRoutes);
console.log("🔍 Verificando existência do arquivo do banco...")
const doesDbExists = existsSync(dbPath);

if(doesDbExists){
    console.log("✅ Arquivo do Banco encontrado, testando conexão...");
    await using conn = await Database.getDatabase();
}else{
    console.log("❌ Banco não encontrado, tentando criar...");
    await Database.initDatabase();
}

server.listen(serverPort,()=>{
    console.log(`🚀 Server rodando na porta ${serverPort}!!!`);
})