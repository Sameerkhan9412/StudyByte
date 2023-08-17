import React from 'react'
import { useState } from 'react';
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgetPassword = () => {
    const [emailSent,setEmailSent]=useState(false);
    const [email,setEmail]=useState("");
    const {loading}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }

  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        {
            loading?(
                <div className='custom-loader'></div>
            ):(
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        {
                            !emailSent?"Reset your Password":"check Your Email"
                        }
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        {
                            !emailSent?`Have no fear , we will email you instruction to reset your password .If you don't have access to your email we can try account recovery`:`We have sent the reset email to ${email}`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent&&(
                                <label className='w-full'>
                                    <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>Email Address <sup className="text-pink-200">*</sup></p>
                                    <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="form-style w-full p-2 rounded-md"
                />
                                </label>
                                
                            )

                        }
                        <button type='submit' className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                            {
                                !emailSent?"Reset Password" :"Resend Email"
                            }
                        </button>
                    </form>
                    <div className='mt-6 flex items-center justify-between'>
                    <Link to="/login">
                        <p className='flex items-center gap-x-2 text-richblack-5'>
                        <BiArrowBack /> Back to Login</p>
                        </Link>    
                    </div>
                    <p className='text-yellow-100 mx-auto'>please check spam folder if you not recieve an mail.</p>
                </div>
            )
        }
    </div>
  )
}

export default ForgetPassword