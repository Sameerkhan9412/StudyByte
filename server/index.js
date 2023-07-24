const express=require("express");
const app=express();

const userRoute=require('./routes/User');
const profileRoute=require('./routes/Profile');
const paymentRoute=require('./routes/Payments');
const courseRoute=require('./routes/Course');

const database=require("./config/database");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");
dotenv.config();
const PORT=process.env.PORT||3000;

// connect databse
database.connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"*",
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth",userRoute);
app.use("/api/v1/profile",profileRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/payment",paymentRoute);


// default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is up and running....." 
    })
})

// activate the server at port no 4000
app.listen(PORT,()=>{
    console.log(`app is running ${PORT}`);
})








