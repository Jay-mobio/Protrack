import jwt from "jsonwebtoken"
import moment from 'moment'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import dotenv from "dotenv"
import { User } from "../models/index.js"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET_KEY

export const isAuthenticated = async (req,res,next) =>{
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({error:"Not Authorized"})
    }
    const token = authHeader.split(' ')[1];
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = await User.findById(decode.id)
        next()
    } catch(err){
        console.log(err.message);
        
        return res.status(403).json({error:"Invalid Token"})
    }
}

export const login = async (req, res) => {
    try{
        const data = req.body
        const user = await User.findOne({email:data.email});
        if (!user){
            return res.status(404).json({ error: "User not found"})
        }
        const ispasswordvalid = await bcrypt.compare(data.password,user.password)

        
        
        if (!ispasswordvalid){
            return res.status(401).json({ status:"Failed",data:[], message:"Invalid Email or Password" })
        }
        const token = jwt.sign({ email: user.email,id:user._id },JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({
            status:"Success",
            data: token,
            message:"You have logged in successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error"})
    }
};

export const resetEmail = async (req, res) => {
    try {
        const user_email = req.body.email;
        const user = await User.findOne({email:user_email});
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = moment().add(5, 'minutes').toDate(); // Calculate OTP expiry time

        // Save OTP and expiry time in the user's document
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        const updated_user = await User.findByIdAndUpdate({_id:user._id},{otp: otp, otpExpiry:otpExpiry});
        const mailSender = async (email, title, body) => {
            try {
              // Create a Transporter to send emails
              console.log(process.env.HOST);
              let transporter = nodemailer.createTransport({
                host: process.env.HOST,
                port: 465,
                secure: true,
                auth: {
                  user: process.env.USER,
                  pass: process.env.PASS,
                }
              });
              // Send emails to users
              let info = await transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: title,
                html: body,
              });
              console.log("Email info: ", info);
              return info;
            } catch (error) {
              console.log(error.message);
            }
          };
        mailSender(user_email, "Reset Email", `Your OTP is: ${otp}`)
        return res.status(200).json({"message": "Reset Emailsent successfully"})
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const verifyOtp = async (req,res) => {
    try{
        const otp = req.body.otp
        const email = req.body.email
        const user = await User.findOne({ email: email})
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        function verifyOTP(userOTP, storedOTP, expirationDurationInMinutes = 5) {
            const currentTimestamp = moment();
            const storedTimestamp = user.otpExpiry
        
            if (currentTimestamp.diff(storedTimestamp, 'minutes') <= expirationDurationInMinutes) {
                if (userOTP === storedOTP) {
                    return true; // OTP is valid and not expired
                }
            }
            return false; // OTP is either invalid or expired
        }
        console.log(user.otp);
        
        let otpverification = verifyOTP(otp,user.otp)
        if (otpverification){
            return res.status(202).json({"message":"Otp Verification Succesfull"})
        }
        else{
            res.status(401).json({"message":"Otp verification failed"})
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({error:e})
    } 
};

export const resetPassword = async (req, res) => {
    try{
        const email = req.body.email
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const user = await User.findOne({email: email})
        console.log(user.password,"old password");
        if (!user){
            return res.status(404).json({error:"User not found"})
        }
        if (password === confirmPassword){
            return res.status(401).json({error:"Password Did not match"})
        }
        const salt = await bcrypt.genSalt(10);
        let new_password = await bcrypt.hash(password,salt)
        console.log(new_password,"new password");
        user.password = new_password
        await user.save()
        return res.status(200).json({message:"Password reset completed"})
    }catch(err){
        console.log(err);   
        return res.status(500).json({error:err.message})
    }
};