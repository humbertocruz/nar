import prisma from '../_prisma' // prisma client
import { checkToken } from '../_auth' // auth mechanism

export default async (req:any, res:any) => {
    const body = req.body;
    const query = req.query;
    const method = req.method;
    const headers = req.headers;
    
    if (!prisma[query.model]) {
        res.json({
            succes:false,
            method:method,
            err:'Model not found!'
        })
    } else {
        const check = await checkToken(headers.authorization)
        if (!check) {
            return res.status(403).json({
                succes:false,
                method:method,
                err:'Invalid Token!'
            })
        }
        switch (method){
            case 'OPTIONS':
                res.status(200).send('')
                break
            
            case 'PUT': // PUT REQUEST - Update
                try {
                    const data = await prisma[query.model].update({data:body,where:{id:query.id}})
                    // return json result
                    return res.json({
                        succes:true,  //status
                        method:method, // method
                    })
                } catch(err){
                    console.log(err)
                    return res.status(500).json({ // server error 500
                        succes:false,
                        method:method,
                        err:err
                    })
                }
                break
            case 'DELETE': // DELETE REQUEST - Delete
                try {
                    const data = await prisma[query.model].delete({where:{id:query.id}}) // delete record id
                    // return json result
                    return res.json({
                        succes:true,  //status
                        method:method, // method
                    })
                } catch(err){
                    console.log(err)
                    return res.status(500).json({ // server error 500
                        succes:false,
                        method:method,
                        err:err
                    })
                }
                break
            default: // methods not implemented
                return res.json({
                    succes:false, // status
                    method:method, // method
                    err:'Method not implemented!' // error
                })
        }
    } 
}