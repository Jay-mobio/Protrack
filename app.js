import express from 'express';
import bodyParser from 'body-parser'
import connectDB from './database.js';
import cors from 'cors';
import { authRouter, categtoriesRouter, cutsomerRouter, employeeRouter, OpportunityRouter, projectRouter, reportRoutes, RiskRouter, spaceRouter, teamMemberRouter, teamsRouter, technologiesRouter, userRouter} from './routes/index.js';




const app = express();

app.use(cors({
    origin: '*'
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/space",spaceRouter)
app.use("/api/v1/projects",projectRouter)
app.use("/api/v1/team-member",teamMemberRouter)
app.use("/api/v1/users",employeeRouter)
app.use("/api/v1/customers",cutsomerRouter)
app.use("/api/v1/technology",technologiesRouter)
app.use("/api/v1/teams",teamsRouter)
app.use("/api/v1/category",categtoriesRouter)
app.use("/api/v1/reports",reportRoutes)
app.use("/api/v1/admin",userRouter)
app.use("/api/v1/opportunity",OpportunityRouter)
app.use("/api/v1/risk",RiskRouter)


// Connect to the database
connectDB();


app.listen(8000, () => {
    console.log("Server running on port 8000");
});


app.get('/url', (req, res) => {
    return res.send('Welcome to protrack!');
});



app.post('/login', async function (req, res) {
    try{
        const data = req.body
        const user = await User.findOne({email:data.email});
        if (!user){
            return res.status(404).json({ error: "User not found"})
        }
        const ispasswordvalid = await bcrypt.compare(data.password,user.password)
        console.log(JWT_SECRET);
        
        
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
});

app.post('/reset-email', async (req, res) => {
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
});

app.post('/verify-otp', async (req, res) => {
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
})

app.put('/reset-password', async(req, res) => {
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
})
