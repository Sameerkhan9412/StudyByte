import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import {AiFillEyeInvisible,AiFillEye} from "react-icons/ai"
import { resetPassword } from '../services/operations/authAPI';
import { Link } from 'react-router-dom';


const UpdataPassword = () => {
    const dispatch=useDispatch();
    const location=useLocation();
    const [formData,setFormData]=useState({
        password:"",
        confirmPassword:"",
    })
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const {loading}=useSelector((state)=>state.auth);
    

    const {password,confirmPassword}=formData;

    const handlerOnchange=(e)=>{
        setFormData((prevData)=>(
            {
                ...prevData,[e.target.name]:e.target.value,
            }
        ))
    }
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        const token=location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token));
    }

  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        {
            loading?(
                <div className="custom-loader"></div>
              ):
            (<div className='max-w-[500px] p-4 lg:p-8'>
                <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>choose a new Password</h1>
                <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'>almost done . Enter your new Password and youre all set .</p>
                <form onSubmit={handleOnSubmit}>
                    <label className='relative'>
                        <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>New Password <sup className="text-pink-200">*</sup></p>
                        <input type={showPassword?"text":"password"} required name='password' value={password} placeholder='password' onChange={handlerOnchange} className='form-style w-full !pr-10' />
                    <span onClick={()=>setShowPassword((prev)=>!prev)} className='absolute right-3 top-[38px] z-[10] cursor-pointer'>
                        {
                            showPassword?<AiFillEyeInvisible fontSize={24} />:<AiFillEye fontSize={24}/>
                        }
                    </span>
                        </label>
                    <label className='relative mt-3 block'>
                        <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>Confirm Password  <sup className="text-pink-200">*</sup></p>
                        <input type={showConfirmPassword?"text":"password"} required name='confirmPassword' value={confirmPassword} onChange={handlerOnchange} placeholder='confrim password' className='form-style w-full !pr-10' />
                    <span onClick={()=>setShowConfirmPassword((prev)=>!prev)} className='absolute right-3 top-[38px] z-[10] cursor-pointer'>
                        {
                            showConfirmPassword?<AiFillEyeInvisible fontSize={24} />:<AiFillEye fontSize={24}/>
                        }
                    </span>
                        </label>
                        <button type='submit' className='mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900'>Reset Password</button>
                </form>
                <div className='mt-6 flex items-center justify-between'>
                    <Link to="/login">
                        <p className='flex items-center gap-x-2 text-richblack-5'>
                            Back to Login
                            </p>
                        </Link>    
                    </div>
            </div>)
        }
    </div>
  )
}

export default UpdataPassword