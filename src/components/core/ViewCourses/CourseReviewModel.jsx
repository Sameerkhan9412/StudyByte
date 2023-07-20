import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import RatingStars from '../../common/RatingStars';
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';


const CourseReviewModel = ({setReviewModal}) => {
    const {user}=useSelector((state)=>state.profile);
    const {token}=useSelector((state)=>state.auth)
    const {courseEntireData}=useSelector((state)=>state.viewCourse);

    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors},
    }=useForm();

    useEffect(()=>{
        setValue("courseExperience","");
        setValue("courseRating",0);
    },[])

    const ratingChanged=(newRating)=>{
        setValue("CourseRating",newRating);
    }

    const onSubmit=async(data)=>{
        await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience
            },
            token
        );
        setReviewModal(false)
    }
  return (
    <div>
        <div>
            {/* modal heading */}
            <div>
                <p>Add Review</p>
                <button onClick={setReviewModal}>
                    close
                </button>
            </div>
            {/* modal body */}
            <div>
                <div>
                    <img src={user?.image} alt="user Image" className='aspect-square w-[50px] rounded-full object-cover' />
                    <div>
                        <p>{user?.firstName} {user?.lastName}</p>
                        <p>Posting Publicly</p>
                    </div>
                </div>
                <form  onSubmit={handleSubmit(onSubmit)} className='mt-6 flex flex-col items-center'>
                    <RatingStars count={5} onChange={ratingChanged} size={24} activeColor="#ffd700" />
                    <div>
                        <label htmlFor="courseExperience">
                            Add Your Experiences
                        </label>
                        <textarea name="" id="courseExperience" placeholder='Add your experience here'
                        {...register("courseExperience",{required:true})} className='form-style min-h-[130px] w-full '
                        />
                        {
                            errors.courseExperience &&(
                                <span>Please add your experience</span>
                            )
                        }
                    </div>
                    {/* Cancel and save button  */}
                    <div>
                        <button onClick={()=>setReviewModal(false)}>Cancel</button>
                        <IconBtn text="save"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModel