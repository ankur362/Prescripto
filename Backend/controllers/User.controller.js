import validator from "validator";
import bcrypt from "bcrypt";
import dotenv, { parse } from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
import userModel from "../models/User.model.js";

import {v2 as cloudinary} from "cloudinary"
import mongoose from "mongoose";
import DoctorModel from "../models/Doctor.model.js";
import appointmentModel from "../models/appionment.model.js";


// Cloudinary configuration


// API to register
const userRegister = async (req, res) => {
    try {
        
        
        const { name, email, password, address, phone, gender, dob } = req.body;
        const imageFile = req.file;
   
   
        console.log(name,email,password,imageFile,password,phone,gender,dob)
        // Validate required fields
        if (!name || !email || !password || !address || !phone || !gender || !dob) {
           
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!imageFile) {
            return res.status(400).json({ error: "Image is required" });
        }
       
        // Validate email format
        if (!validator.isEmail(email)) {
        
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Validate password length
        if (password.length < 8 || password.length > 15) {
            console.log('Error in userRegister:', error);
            
            return res.status(400).json({ error: "Password must be at least 8 characters and less than 15 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "auto" });
        const imageUrl = imageUpload.secure_url;

        // Format date to DD-MM-YYYY
        const currentDate = new Date(dob);
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // Prepare user data for saving
        const userData = {
            name,
            email,
            password: hashedPassword,
            phone,
            gender,
            address: JSON.parse(address),  // Ensure the address format is consistent
            dob: formattedDate,
            image: imageUrl
        };

        // Save user to the database
        const newUser = new userModel(userData);
        const user = await newUser.save();
        res.json({success: true,message:'New User Created'})
      
      

    } catch (error) {
        console.error({ error });
        res.status(500).json({ success: false, message: error.message });
    }
};
const logIn = async(req,res)=>{
    
   try {
    
    const {email,password} = req.body
    const user = await userModel.findOne({ email });
    if(!user)
        {
            return res.status(400).json({ error: "no user found " });
        }
           // Compare entered password with the hashed password in the database
           const isPasswordValid = await bcrypt.compare(password, user.password);
           if (!isPasswordValid) {
               return res.status(400).json({ error: "Invalid password" });
           }
    
           // Generate a JWT token for the authenticated user
           const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
    
           // Respond with success message and token
           res.json({ success: true, token,message:'Login successfully' });
   } catch (error) {
    console.log({error});
    res.status(500).json({ success: false, message: error.message });
   } 

}
const getProfile =async(req,res)=>{
    try {
        
     
        const userId = new mongoose.Types.ObjectId(req.body.userId);
        const userData =await userModel.findById({_id: userId}).select('-password')
        console.log(userData);
        
        res.json({success:true,userData})
        
    } catch (error) {
        console.log({error});
        res.status(500).json({ success: false, message: error.message });
    }
}
const updateProfile =async(req,res)=>{
    try{
        const {userId, name, phone, address, dob, gender} = req.body;
        const imageFile =req.file
        if(!name||!phone||!address||!dob||!gender)
        {
            return res.json({success:false,message:'All field required'})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile)
        {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
             const imageUrl =imageUpload.secure_url
             await userModel.findByIdAndUpdate(userId,{image:imageUrl})
        }
        res.json({success:true,message:'User Successfully updated'})

    }
    catch(error)
    {
        console.log({error});
    res.status(500).json({ success: false, message: error.message });
   
    }
}
//API to book Appointment
const bookAppointment = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.body.userId);
      const { docId, slotDate, slotTime } = req.body;
  
      const docData = await DoctorModel.findById(docId).select('-password');
      if (!docData || !docData.available) {
        return res.json({ success: false, message: 'Doctor is not available' });
      }
  
      let slots_booked = docData.slots_booked || {};
  
      // Ensure slotDate exists in slots_booked as an array
      if (!slots_booked[slotDate]) {
        slots_booked[slotDate] = [];
      }
  
      // Check if slotTime is already booked
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot is already booked' });
      } else {
        // Add the slotTime to the booked slots for that date
        slots_booked[slotDate].push(slotTime);
      }
  
      const userData = await userModel.findById(userId).select('-password');
      const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now(),
      };
  
      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();
  
      // Update the doctor document with the new slots_booked data
      await DoctorModel.findByIdAndUpdate(docId, { slots_booked });
  
      res.json({ success: true, message: 'Appointment booked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  const listAppointment = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.body.userId);
  
      // Fetch appointments for the user
      const appoinments = await appointmentModel.find({ userId });
      
      // Extract docIds from appointments and fetch associated doctor data
      const doctorDataPromises = appoinments.map(async (appointment) => {
        const doctorData = await DoctorModel.findById(appointment.docId);
        return { ...appointment._doc, docData: doctorData }; // Merge doctor data with appointment data
      });
  
      // Wait for all doctor data to be fetched
      const appointmentsWithDoctors = await Promise.all(doctorDataPromises);
  
      // Send the response with enriched appointment data
      res.json({ success: true, appoinments: appointmentsWithDoctors });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  const cancelAppointment =async (req,res)=>
  {
    try {
      
      const userId = new mongoose.Types.ObjectId(req.body.userId);
  
  
    const {appoinmentId}=req.body
   
    const appointmentData = await appointmentModel.findById(appoinmentId)
    
    //verify appointment user
    
    if(appointmentData.userId.toString() !== userId.toString()){
        return res.json({success:false,message:'Unauthorized action'})
    }
    await appointmentModel.findByIdAndUpdate(appoinmentId,{cancelled:true})
    //releasing data
    const { docId, slotDate, slotTime }=appointmentData
    const doctorData = await DoctorModel.findById(docId)
    let slots_booked =doctorData.slots_booked
    slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
    await DoctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({success:true,message:'appointment cancelled'})
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
  
    }
    


  }
 
  ///API to make of appoiment payment 11     ;30 to 
  const payOnline = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.body.userId);
      const { appointmentId } = req.body;
  
      if (!appointmentId) {
        return res.status(400).json({ success: false, message: 'Appointment ID is required' });
      }
  
      // Fetch the appointment data
      const appointment = await appointmentModel.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
  
      // Verify if the appointment belongs to the user
      if (appointment.userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized action' });
      }
  
      // Check if the appointment is already paid
      if (appointment.payment) {
        return res.status(400).json({ success: false, message: 'Appointment is already paid' });
      }
  
      // Update the payment status of the appointment
      appointment.payment = true;
      await appointment.save();
  
      res.json({ success: true, message: 'Payment successful', appointment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  

export { userRegister ,
  logIn,
  getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,payOnline};
