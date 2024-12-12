import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/Mongodb.js";
import connectCloudinary from "./config/Cloudinary.js";
import adminRouter from "./routes/Admin.route.js";
import doctorRouter from "./routes/Doctor.route.js";
import userRouter from "./routes/User.route.js";
// Import bcryptjs instead of bcrypt
import bcrypt from 'bcryptjs';
//app config
const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
// Enable CORS with specific options

app.use(cors({
    origin: '*',  // Allow all origins
    credentials: true,
}));
//middleware
app.use(express.json());


//api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user",userRouter)
//localhost:4000/api/admin/addDoctor
app.get('/', (req, res) => {res.send('Hello World')});

//listen
app.listen(port, () => console.log(`Server is running on port ${port}`));
