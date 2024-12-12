import DoctorModel from "../models/Doctor.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appionment.model.js";
import { json } from "express";
import {v2 as cloudinary} from "cloudinary"
import mongoose from "mongoose";

const changeAvailability = async (req, res) => {
   
    try {
        const {docId} = req.body;
        console.log(docId)
        
        const docData = await DoctorModel.findById(docId);
        
        // Check if docData is null
        if (!docData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Update the availability
        await DoctorModel.findByIdAndUpdate(docId, { available: !docData.available });

        res.json({ success: true, message: "Availability Changed" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
const getAllDoctor = async (req,res)=>{
    try{
        const allDoc =await DoctorModel.find({}).select(['-password','-email'])
       res.json({success:true,allDoc})

    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
//api for doctor Login
const loginDoctor = async (req,res)=>{
    try {
        const {email,password}=req.body
        console.log(email);
        
       const user = await DoctorModel.findOne({email})
       if(!user)
       {
        res.json({success:false,message:"User Don't Exist"})
       }
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if (!isPasswordValid) {
            return res.json({success:false, message: "Invalid password" });
        }
 
        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
        console.log(token)
        res.json({success:true,token,message:"login succesfull"})

 
        // Respond with success message and token
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Try Again"})
    }
       

}
// api to get appointment of particular doctor
const appointmentsDoctor=async(req,res)=>{
    try {
        const docId = new mongoose.Types.ObjectId(req.body.docId);
        
        const appointmentData = await appointmentModel.find({docId})
        console.log(appointmentData);
        res.json({success:true,appointmentData})
    } catch (error) {

       console.log(error) 
       res.json({success:false,message:error.message})
    }
}
//API to mark appointment completed for doctor panel
const appionmentComplete = async (req, res) => {
    try {
        const docId = new mongoose.Types.ObjectId(req.body.docId);
        const { appointmentId } = req.body;

        // Fetch appointment data
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData) {
            // Ensure `docId` is an ObjectId for proper comparison
            const appointmentDocId = new mongoose.Types.ObjectId(appointmentData.docId);

            if (appointmentDocId.equals(docId)) {
                // Mark appointment as completed
                await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
                return res.json({ success: true, message: "Appointment Completed" });
            } else {
                return res.json({ success: false, message: "Unauthorized to complete this appointment" });
            }
        } else {
            return res.json({ success: false, message: "Appointment not found" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


//API to mark cancel Appointment 
const appionmentCancel = async (req, res) => { 
    try {
        const docId = new mongoose.Types.ObjectId(req.body.docId);
        const { appointmentId } = req.body;

        // Find the appointment by ID
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Convert docId to ObjectId if it's a string
        const appointmentDocId = new mongoose.Types.ObjectId(appointmentData.docId);

        // Check if the docId matches
        if (appointmentDocId.equals(docId)) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: 'Appointment Cancelled' });
        } else {
            return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
//API to dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const docId = new mongoose.Types.ObjectId(req.body.docId); // Ensure docId is received
        const appointment = await appointmentModel.find({ docId });

        // Calculate earnings
        let earning = 0;
        appointment.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earning += item.amount;
            }
        });

        // Calculate unique patient count
        let patient = [];
        appointment.forEach((item) => {
            if (!patient.includes(item.userId.toString())) {
                patient.push(item.userId.toString());
            }
        });

        // Prepare dashboard data
        const dashData = {
            earning,
            appointments: appointment.length,
            patient: patient.length,
            latestappointment: appointment.reverse().slice(0, 5),
        };

        res.status(200).json({ success: true, dashData });
    } catch (error) {
        console.error("Error fetching doctor dashboard data:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard data. Please try again later." });
    }
};



//Doctor profile
const getProfile =async(req,res)=>{
    try {
        
     
        const docId = new mongoose.Types.ObjectId(req.body.docId);
       
        
        const docData =await DoctorModel.findById({_id: docId}).select('-password')
        console.log(docData);
        
        
        
        res.json({success:true,docData})
        
    } catch (error) {
        console.log({error});
        res.json({ success: false, message: error.message });
    }
}
//update profile
const updateProfile = async (req, res) => {
    try {
        const docId = new mongoose.Types.ObjectId(req.body.docId);

        const { fees, address, available } = req.body;
        console.log(fees);
        

        // Check if address needs parsing
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

        // Update the profile
        await DoctorModel.findByIdAndUpdate(
            { _id: docId },
            { address: parsedAddress, fees, available }
        );

        res.json({ success: true, message: 'Profile successfully updated' });
    } catch (error) {
        console.log({ error });
        res.json({ success: false, message: error.message });
    }
};



export { changeAvailability,getAllDoctor,loginDoctor,appointmentsDoctor,appionmentComplete,appionmentCancel,doctorDashboard,getProfile,updateProfile };
