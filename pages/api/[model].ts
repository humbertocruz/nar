import prisma from './_prisma'
import { checkToken } from './_auth'
import { v4 } from 'uuid'

export default async (req, res) => {
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
            case 'GET':
                try {
                    let options = {}
                    if (query.take) options.take = parseInt(query.take)
                    if (query.skip) options.skip = parseInt(query.skip)
                    if (query.include) {
                        let include = query.include.split(',')
                        options.include = {}
                        include.map((i)=>options.include[i]=true)
                    }
                    let data = await prisma[query.model].findMany(options)
                    let ret = []
                    data.map((d)=>{
                        delete d.password
                        delete d.token
                        delete d.passCode
                        ret.push(d)
                    })
                    return res.status(200).json({
                        succes:true,
                        method:method,
                        data:ret,
                        total: await prisma[query.model].count()
                    })
                    prisma.$disconnect()
                    break
                } catch(err){
                    console.log(err)
                    return res.status(500).json({
                        succes:false,
                        method:method,
                        err:err
                    })
                }
                break
            case 'POST':
                const data = await prisma.user.create({data:body})
                return res.json({
                    succes:true,
                    method:method,
                    err:'Create'
                })
                break
            default:
                return res.json({
                    succes:false,
                    method:method,
                    err:'Method not implemented!'
                })
        }
    } 
}