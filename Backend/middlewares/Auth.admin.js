import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
//middleware for admin authentication
 const authAdmin = async (req,res,next) => {
    try {
        const aToken = req.headers.authorization.split(" ")[1];
        if(!aToken){
            return res.json({success:false,message:"Token is required"});
        }
        const decoded = jwt.verify(aToken,process.env.JWT_SECRET);
       if(decoded!== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD)
        {
        return res.json({success:false,message:"Not authorized Login again"});
       }
       
        next();
      
    } 
    catch (error) {
        console.log({error});
        res.json({ success: false, message: error.message });
    }
 
}
export default authAdmin;
