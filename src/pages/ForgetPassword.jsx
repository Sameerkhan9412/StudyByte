import React from 'react'
import { useState } from 'react';
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
    <div className='text-white flex justify-center items-center h-[100vh]'>
        {
            loading?(
                <div>loading...</div>
            ):(
                <div>
                    <h1>
                        {
                            !emailSent?"Reset your Password":"check Your Email"
                        }
                    </h1>
                    <p>
                        {
                            !emailSent?`Hve no fear , we will email you instruction to reset your password .If you don't have access to your email we can try account recovery`:`We have sent the reset email to ${email}`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent&&(
                                <label>
                                    <p>Email Address</p>
                                    <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="text-richblack-900"
                />
                                </label>
                                
                            )

                        }
                        <button type='submit'>
                            {
                                !emailSent?"Reset Password" :"Resend Email"
                            }
                        </button>
                    </form>
                    <div>
                    <Link to="/login">
                        <p>Back to Login</p>
                        </Link>    
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default ForgetPassword