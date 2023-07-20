import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from "../components/core/ViewCourses/VideoDetailsSidebar"
import CourseReviewModal from "../components/core/ViewCourses/CourseReviewModel"

const ViewCourse = () => {
    const [reviewModal,setReviewModal]=useState(false);
    const {courseId}=useParams();
    const {token}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    useEffect(()=>{
        const setCourseSpecificDetails=async()=>{
            const courseData=await getFullDetailsOfCourse(courseId,token);
            console.log("coure ddata is here",courseData)
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setCompletedLectures(courseData.completedVideos));
            let lectures=0;
            courseData.courseDetails?.courseContent?.forEach((sec)=>{
                lectures+=sec.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures));
        }
        setCourseSpecificDetails();
    },[])
  return (
    <>
    <div className='text-white'>
        <VideoDetailsSidebar setReviewModal={setReviewModal}/>
        <div >
            <Outlet/>
        </div>
    </div>
    {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}

    </>
  )
}

export default ViewCourse