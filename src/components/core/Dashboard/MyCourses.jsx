import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import IconBtn from '../../common/IconBtn';
import {AiOutlinePlus} from "react-icons/ai";
import CoursesTable from './InstructorCourses/CoursesTable';


const MyCourses = () => {
    const {token}=useSelector((state)=>state.auth);
    const navigate=useNavigate();
    const [courses,setCourses]=useState([]);

    useEffect(()=>{
        const fetchCourses=async()=>{
            const result=await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        }
        fetchCourses();
    },[])
  return (
    <div className='text-white'>
        <div className='flex  flex-col' >
            <h1>My Courses</h1>
            <IconBtn text="Add Course" onclick={()=>navigate("/dashboard/add-course") } className="w-auto">
            <AiOutlinePlus/>
            </IconBtn>
        </div>
        {courses && <CoursesTable courses={courses} setCourses={setCourses}/> }
    </div>
  )
}

export default MyCourses