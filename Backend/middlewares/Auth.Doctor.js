import jwt from 'jsonwebtoken'
const authDoctor =async (req,res,next)=>{
    try{
        const dToken = req.headers.authorization.split(" ")[1];
       
        console.log(dToken);
        
        
        if(!dToken){
            return res.json({success:false,message:'Not Authorized Login again '})

        }
        const token_decode=jwt.verify(dToken,process.env.JWT_SECRET)
        console.log(token_decode);
        
        req.body.docId=token_decode.id
        next()
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}
export default authDoctor