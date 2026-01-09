
// middleware (protected educator route)
export const protectedEducator = async(req,res,next)=>{
    try{
        const userId = req.auth.userId
        const response = await req.auth.sessionClaims?.publicMetadata?.role

        if(response !== 'educator'){
            return res.json({success:false,message:'Unauthorized Access'})
        }
        next()
    }catch(err){
        res.json({success:false,message:err.message})
    }
}