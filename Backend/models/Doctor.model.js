import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
   degree:{
    type: String,
    required: true,
   },
   about:{
    type: String,
    required: true,
   },
   available:{   
    type: Boolean,
    default: true
   },
   fees:{
    type: Number,
    required: true,
   },
   address:{
    type: Object,
    required: true,
   },
   dateofjoin:{
    type: String,
    required: true,
   },
   slots_booked:{
    type: Object,
   
    default: {}
   }},
   {
       timestamps: true
   }
   ,{minimize:false}
  
    
);
const DoctorModel = mongoose.models.DoctorModel || mongoose.model('DoctorModel', doctorSchema);

export default DoctorModel;
