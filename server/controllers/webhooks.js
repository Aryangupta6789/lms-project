import {Webhook} from 'svix'
import user from '../models/user.js'
import connectDB from '../configs/mongodb.js'


export const clerkWebhooks = async(req,res)=>{
    console.log('🔥 CLERK WEBHOOK HIT 🔥')
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        const payload = req.body.toString('utf8')
        const event = await whook.verify(payload,{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })

        await connectDB()

        const {data,type}=event
        console.log(type)
        switch(type){
            case 'user.created' : {
                const userData = {
                    _id : data.id,
                    email: data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    imageUrl: data.image_url

                }
                await user.create(userData)
                res.json({})
                break;
            }

            case 'user.updated' : {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    imageUrl:data.image_url
                }
                await user.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted' : {
                await user.findByIdAndDelete(data.id)
                res.json({})
                break
            }
            default:
                break
        }
    }catch(err){
        res.json({success:false,message:err.message})
    }

}