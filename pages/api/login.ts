import { PrismaClient } from "@prisma/client";
import { v4 } from 'uuid'
import { verify, generate } from 'password-hash'
    
export default async (req, res) => {
    /**
     * @description Login by email/password
     * @param email
     * @param password
     */
    const body = req.body
    const method = req.method

    switch(method){
      
      case 'POST':

          try {
            const prisma = new PrismaClient({
              errorFormat: 'minimal',
            });
            // search user by email
            const login = await prisma.user.findUnique({
                where:{
                    email:body.email
                }
            })
            // if the user password is empty, save a new password using the sended password
            if (login&&login.password=='') {
                const hash = generate(body.password)
                await prisma.user.update({
                    data:{
                        password:hash
                    },
                    where:{
                        id:login.id
                    }
                })
                login.password = hash
            }
            
            // if the password hash is not the same, return error
            if (!login||!verify(body.password,login.password)) {
                await prisma.$disconnect()
                res.json({
                    success: false,
                    message: 'User not found or invalid password!'
                })
                break
            }
            delete(login.password)
            
            // generate a login token
            const token = v4()
            login.token = token
            // update the user record with the new generated token
            await prisma.user.update({
                where:{
                    id:login.id
                },
                data:{
                    token: token
                }
            })
            // return user data
            await prisma.$disconnect()
            res.json({
                success: true,
                message: 'Successful login!',
                token: token,
                user: login
            })
            break
          } catch(err){
              console.log(err)
              await prisma.$disconnect()
              res.json({
                  success: false,
                  error:err,
                  message: 'There is a error!'
              })
          }
          break
      default:
          // Se não for o método POST retorna com erro
          res.json({
              success:false,
              err:'Method not implemented!'
          });
          break;
  }  
}
