import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { Link,useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };
  return(
  <div className="text-2xl text-white justify-center">
    {loading ? (
      <div>Loading...</div>
    ) : (
      <div>
        <h1>Verfiy Email</h1>
        <p>A verfication code has been sent to you . Enter the code below</p>
        <form onSubmit={handleOnSubmit}>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} className="text-white bg-richblack-500 " placeholder="-" />}
          />
          <button type="submit">Verify Email</button>
        </form>
        <div>
          <Link to="/login">
            <p>Back to Login</p>
          </Link>
        </div>
        <button onClick={() => dispatch(sendOtp(signupData.email,navigate))}>
          Resend It
        </button>
      </div> 
    )}
 </div>
);
}
export default VerifyEmail;
