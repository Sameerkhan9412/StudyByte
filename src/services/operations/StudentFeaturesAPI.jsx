import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis"
import { apiConnector } from "../apiConnector";
import rzrLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API}=studentEndpoints;

function loadScript(src){
    return new Promise((resolve)=>{
        const script =document.createElement("script");
        script.src=src;
        script.onload=()=>{
            resolve(true);
        }
        script.onerror=()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}
export async function buyCourse(token,courses,userDetails,navigate,dispatch){
    const toastId=toast.loading("loading...");
    try{
        // load the script
        const res=await  loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
            toast.error("Razorpay SDK failed to load")
            return;
        }
        // initiate the order
        const orderResponse=await apiConnector("POST",COURSE_PAYMENT_API,{courses},{
            Authorization:`Bearer ${token}`,
        })
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }
        // options
        const options={
            key:process.env.RAZORPAY_KEY,
            currency:orderResponse.data.message.currency,
            amount:`${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name:"StudyByte",
            description:"Thank you for Purchasing the course",
            image:rzrLogo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler:function(response){
                // send successfully mail
                // verify email
                verifyPayment({...response,courses},token,navigate,dispatch)
            }
        }
        // missing ho gya tha
        const paymentObject=new window.Razorpay(options)
        paymentObject.open();
        paymentObject.on("payment.failed",function(response){
            toast.error("Oops ,Payment Failed")
            console.log(response.error )
        })
    }
    catch(error){
        console.log("Payment API Error..............")
        toast.error("could not make Payment")
        console.log(error);
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response,amount,token){
    try {
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            order_id:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount,
        },{
            Authorization:`Bearer ${token}`
        })
    } catch (error) {
            console.log("PAYMENT SUCCESS EMAIL ERROR",error);
    }
}


// verify payment
async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId=toast.loading("Verifing Payment.....")
    dispatch(setPaymentLoading(true))
    try {
        const response=await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization:`Bearer ${token}`,
        });
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Payment Successful , your are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error)
        toast.error("could not verify payment")
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}