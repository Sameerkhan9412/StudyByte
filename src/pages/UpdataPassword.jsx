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
    <div className='text-white'>
        {
            loading?(<div>
                Loading
            </div>):
            (<div>
                <h1>choose a new Password</h1>
                <p>almost done . Enter your new Password and youre all set .</p>
                <form onSubmit={handleOnSubmit}>
                    <label>
                        <p>New Password</p>
                        <input type={showPassword?"text":"password"} required name='password' value={password} placeholder='password' onChange={handlerOnchange} className='w-full p-6 bg-richblack-600 text-richblack-5' />
                    <span onClick={()=>setShowPassword((prev)=>!prev)}>
                        {
                            showPassword?<AiFillEyeInvisible fontSize={24} />:<AiFillEye fontSize={24}/>
                        }
                    </span>
                        </label>
                    <label>
                        <p>Confirm Password</p>
                        <input type={showConfirmPassword?"text":"password"} required name='confirmPassword' value={confirmPassword} onChange={handlerOnchange} placeholder='confrim password' className='w-full p-6 bg-richblack-600 text-richblack-5' />
                    <span onClick={()=>setShowConfirmPassword((prev)=>!prev)}>
                        {
                            showConfirmPassword?<AiFillEyeInvisible fontSize={24} />:<AiFillEye fontSize={24}/>
                        }
                    </span>
                        </label>
                        <button type='submit'>Reset Password</button>
                </form>
                <div>
                    <Link to="/login">
                        <p>Back to Login</p>
                        </Link>    
                    </div>
            </div>)
        }
    </div>
  )
}

export default UpdataPassword