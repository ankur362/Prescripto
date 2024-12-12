import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, logIn, updateProfile, userRegister,payOnline } from '../controllers/User.controller.js'
import upload from "../middlewares/Multer.js";
import authUser from '../middlewares/Auth.User.js';
const userRouter = express.Router()
userRouter.post("/register", upload.single("image"),userRegister);
userRouter.post("/login",logIn);
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appoinment',authUser,bookAppointment)
userRouter.get('/list-appoinment',authUser,listAppointment)
userRouter.post('/cancel-appoinment',authUser,cancelAppointment)
userRouter.post('/pay-online',authUser,payOnline)






export default userRouter