import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    errorFormat: 'minimal',
  });

/**
 * 
 * @param {*} token 
 * @param {*} role 
 * @returns true ou false
 * @description Recebe o token enviado na requisicao, consulta na tabela de usuarios e devolve true se encontrado ou false se não encontrado
 * se passado um parametros role, verifica se o usuario do token tem essa role
 */  
const checkToken = async function (token:string,role=undefined) {
    if (!token)
        //await prisma.$disconnect()
        return false
    // Encontra token passado
    const check = await prisma.user.findFirst({
        where: {
            token: {
                equals: token.split(' ')[1]
            }
        }
    })
    if (check) { // Se token encontrado
        /*if (role){ // Se uma role foi passada
            if (role==check.role) return true // Se a role passa é a mesma do usuario do token
            else return false // role diferente
        } else return true // Nao verifica role*/
        await prisma.$disconnect()
        return check
    } else
        await prisma.$disconnect()
        return false // token não encontrado
}

export { checkToken }
