import jwt from 'jsonwebtoken'
const authUser =async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log('hello');
        console.log(token);
        
        
        if(!token){
            return res.json({success:false,message:'Not Authorized Login again '})

        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET)
        console.log(token_decode);
        
        req.body.userId=token_decode.id
        next()
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}
export default authUser