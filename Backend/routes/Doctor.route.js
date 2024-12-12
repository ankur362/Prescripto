import express from "express";
import { appionmentCancel, appionmentComplete, appointmentsDoctor, doctorDashboard, getAllDoctor, getProfile, loginDoctor, updateProfile } from "../controllers/Doctor.controller.js";
import authDoctor from "../middlewares/Auth.Doctor.js";
const doctorRouter = express.Router();
doctorRouter.get("/list",getAllDoctor);
doctorRouter.post("/login",loginDoctor);
doctorRouter.get("/appointment",authDoctor,appointmentsDoctor);
doctorRouter.post("/accept-appointment",authDoctor,appionmentComplete);
doctorRouter.post("/cancel-appointment",authDoctor,appionmentCancel);
doctorRouter.get("/dashboard",authDoctor,doctorDashboard);
doctorRouter.get("/profile",authDoctor,getProfile);
doctorRouter.post("/update-profile",authDoctor,updateProfile);
export default doctorRouter