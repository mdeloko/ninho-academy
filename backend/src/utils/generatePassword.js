import bcrypt from "bcrypt"

const senha = bcrypt.hashSync("!Senha123",10)
console.log(senha)

console.log(bcrypt.compareSync("!Senha123",senha))
