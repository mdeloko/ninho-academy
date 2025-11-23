import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export const testRouter = Router()
testRouter.get("/hello",(req,res)=>{
    res.status(StatusCodes.OK).json({msg:"Teste Concluído",status:StatusCodes.OK})
})