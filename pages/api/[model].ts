import prisma from './_prisma' // prisma client
import { checkToken } from './_auth' // auth mechanism

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
            case 'GET': // GET REQUEST - READ
                try {
                    let options = {} // prisma options init
                    if (query.take) options.take = parseInt(query.take) // take option
                    if (query.skip) options.skip = parseInt(query.skip) // skip option
                    if (query.include) { // include option
                        let include = query.include.split(',')
                        //@ts-ignoretsignore
                        options.include = {} // prisma include init
                        //@ts-ignoretsignore
                        include.map((i)=>options.include[i]=true) // add includes
                    }
                    let data = await prisma[query.model].findMany(options) // array of data from model with options
                    let ret = [] // init empty array return variable
                    // remove some fields from data
                    data.map((d)=>{
                        delete d.password // user.password should never be listed
                        delete d.token // user.token should never be listed
                        ret.push(d)
                    })
                    // return json with data
                    return res.status(200).json({
                        succes:true, // status
                        method:method, // method used
                        data:ret, // data
                        total: await prisma[query.model].count() // model count for pagination
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
            case 'POST': // POST REQUEST - Create
                try {
                    const data = await prisma.user.create({data:body}) // create record from body data
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