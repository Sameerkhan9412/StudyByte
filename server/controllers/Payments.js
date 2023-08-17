const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {default: mongoose} = require("mongoose");
const crypto =require("crypto");
const CourseProgress=require("../models/CourseProgress")
// for multiple items
exports.capturePayment = async (req, res) => {
    const {courses} = req.body;
    const userId = req.userId;
    console.log("my used id",userId);
    if (courses.length === 0) {
        return res.json({success: false, message: "Please provide course Id"})
    }
    let totalAmount = 0;
    for (const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            console.log("PRINTIND COURSE ID",course_id)
            if (! course) {
                return res.status(200).json({success: false, message: "could not find the course"})
            }
            const UID = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(UID)) {
                return res.status(200).json({success: false, message: "Student is already Enrolled"});
            }
            totalAmount += course.price;
        } catch (error) {
            console.log(error)
            return res.status(500).json({success: false, message: error.message});
        }
    }
    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now().toString())
    }
    try {
        const paymentResponse = await instance.orders.create(options);
        res.json({success: true, message: paymentResponse})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "could not initiate Order"})
    }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body ?. razorpay_order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const razorpay_signature = req.body ?. razorpay_signature;
    const courses = req.body.courses;
    const userId = req.user.id;
    if (! razorpay_order_id || ! razorpay_payment_id || ! razorpay_signature || ! courses || ! userId) {
        return res.status(200).json({success: false, message: "Payment Failed"})
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
    if (expectedSignature === razorpay_signature) { // enroll karao students ko
        await enrolledStudents(courses, userId, res)
        return res.status(200).json({success: true, message: "Payment Verfied"})
    }
    return res.status(200).json({success: false, message: "Payment failed"});
}

// enrolled students
const enrolledStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({success: false, message: "Please Provide data for Courses or useerId"})
    }
    try{
    for (const courseID of courses) {
        const enrolledCourse = await Course.findOneAndUpdate({
            _id: courseID
        }, {
            $push: {
                studentsEnrolled: userId
            }
        }, {
            new: true
        },)
        if (! enrolledCourse) {
            return res.status(500).json({success: false, message: "Course not Found"});
        }

        const courseProgress = await CourseProgress.create({
            courseID: courseID,
            userId: userId,
            completedVideos: [],
          })

        // find the student and add the course to their list of enrolledcourses
        const enrolledStudent = await User.findByIdAndUpdate(userId, {
            $push: {
                courses: courseID,
                courseProgress:courseProgress._id,
            }
        }, {new: true});
        // enrolled student ko mail send kardo
        const emailResponse=await mailSender(
            enrolledStudent.email,
            `successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`+ " "+`${enrolledStudent.lastName}` )
            )
            console.log("Email Sent successfully",emailResponse.response);
    }
}
catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message
    });
}
}


exports.sendPaymentSuccessEmail=async(req,res)=>{
    const {orderId,paymentId,amount}=req.body;
    const userId=req.user.id;
    if(!orderId||!paymentId||!amount||!userId){
        return res.status(400).json({
            success:false,
            message:"Please provide alll the fields"
        })
    }
    try {
        // students ko enroled karao yaar
        const enrolledStudent=await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            "Payment Received",
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
            amount/100,
            orderId,
            paymentId
            )
        )
    } catch (error) {
        console.log("error in sending mail",error)
        return res.status(500).json( {
            success:false,
            message:"Could not send email"
        }   )
    }
}

