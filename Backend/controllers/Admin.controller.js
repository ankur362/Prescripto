//api for adding doctor
import DoctorModel from "../models/Doctor.model.js";
import cloudinary from "cloudinary";
import validator from "validator";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appionment.model.js";
import userModel from "../models/User.model.js";

const addDoctor = async (req, res) => {
    try {
        if (req.body.available === undefined) {
            req.body.available = true;
        }
        const {name,email,password ,specialization, experience,  degree, about,available,fees,address,dateofjoin} = req.body;
        const imageFile = req.file;
        console.log({name,email,password ,specialization,   degree, about,available,fees,address,dateofjoin,imageFile});
        
        
       //checking for all data to be filled
       if(!name || !email || !password || !specialization || !degree || !about || !fees || !address|| !imageFile){
        return res.status(400).json({error:"All fields are required"});
       }
       //validating email format
       if(!validator.isEmail(email)){
        return res.status(400).json({error:"Invalid email format"});
       }
       //validating  password length
       if(password.length < 8 && password.length > 15){
        return res.status(400).json({error:"Password must be at least 8 characters and less than 15 characters"});
       }
       //hashing password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);
       console.log({hashedPassword});
       //uploading image to cloudinary
       const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"auto"});
       const imageUrl = imageUpload.secure_url;
       const currentDate = new Date();
       const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
       const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add leading zero and month is 0-based
       const year = currentDate.getFullYear();
       const formattedDate = `${day}-${month}-${year}`;
       const doctor = {name,
        email,
        password:hashedPassword,
        specialization,
        degree,
        about,
        available,
        fees,
        experience,
        address:JSON.parse(address),
        dateofjoin:formattedDate,
        image:imageUrl};
        console.log({doctor});
       const newDoctor = new DoctorModel(doctor);
       await newDoctor.save();
       res.status(201).json({success:true,message:"Doctor added successfully",doctor:newDoctor});
    } catch (error) {
        console.log({error});
        res.status(500).json({ success: false, message: error.message });
    }
};
//api for login
const loginAdmin = async (req,res) => {
    try {
        const {email,password} = req.body;
        console.log({email,password});
        if(!email || !password){
            return res.status(400).json({error:"All fields are required"});
        }
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
            return res.status(401).json({error:"Invalid credentials"});
       }else{
           const token = jwt.sign(email+ password,process.env.JWT_SECRET);
        //    res.status(200).json({success:true, token});
           res.status(200).json({message:"Login successful",token});
       }
    } catch (error) {
        console.log({error});
        res.status(500).json({ success: false, message: error.message });
   
    }

};
//for doctor in mongodb

const allDoctor = async (req,res) => {
    try {
        const doctors =await DoctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}
//Api to get all Appointment list
const appionmentAdmin = async (req, res) => {
    try {
        // Fetch all appointments
        const appointments = await appointmentModel.find({});
        
        // Use `Promise.all` to fetch doctor details for each `docId` in parallel
        const appointmentsWithDoctorData = await Promise.all(
            appointments.map(async (appointment) => {
                const doctorData = await DoctorModel.findById(appointment.docId).select('-password');
                
                // Add doctor data to each appointment object
                return {
                    ...appointment._doc, // Spread original appointment data
                    doctor: doctorData    // Attach doctor data
                };
            })
        );

        // Send successful response with appointments data, including doctor details
        res.status(200).json({ success: true, appointments: appointmentsWithDoctorData });
        
    } catch (error) {
        // Send error response
        res.status(500).json({ success: false, message: error.message });
    }
};
//cancell the appointment in admin
const cancelAppointmentAdmin =async (req,res)=>
    {
        try {
            
            const {appoinmentId}=req.body
   
            const appointmentData = await appointmentModel.findById(appoinmentId)
            
          
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
          //API to get dashboard data for ADMIN PANEL
          const adminDashboard =async(req,res)=>{
            try {
                const doctors=await DoctorModel.find({})
                const users = await userModel.find({})
                const appoinments =await appointmentModel.find({})
                const dashData={
                    doctors:doctors.length,
                    appoinments:appoinments.length,
                    patients:users.length,
                    latestAppoinments:appoinments.reverse().slice(0,5)               
                 };
           
                
            res.json({success:true,dashData});
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: error.message });
            
            }
          }
         


export {addDoctor,loginAdmin,allDoctor,appionmentAdmin,cancelAppointmentAdmin,adminDashboard};