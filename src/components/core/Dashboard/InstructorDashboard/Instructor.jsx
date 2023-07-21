import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { getInstructorData } from '../../../../services/operations/profileAPI'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import InstructorChart from './InstructorChart'
const Instructor = () => {
    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile);
    const [loading,setLoading]=useState(false);
    const [instructorData,setInstructorData]=useState(null)
    const [courses,setCourses]=useState([])
    useEffect(()=>{
        const getCourseDataWithStats=async()=>{
            setLoading(true);
            // pending
            const instructorApiData=await getInstructorData(token);
            const result=await fetchInstructorCourses(token);
            console.log(instructorApiData)
            if(instructorApiData.length){
                setInstructorData(instructorApiData);
            } 
            if(result){
                setCourses(result);
            }
            setLoading(false);

        }
        getCourseDataWithStats();
    },[])
    const totalAmount=instructorData?.reduce((acc,curr)=>acc+curr.totalAmountGenerated,0)
    const totalStudents=instructorData?.reduce((acc,curr)=>acc+curr.totalStudentsEnrolled,0)
  return (
    <div className='text-white'>
        <div>Hi {user.firstName}</div>
        <p>Lets start something new</p>
        {
            console.log("this is courses",courses)
        }
        {
            loading?<div>Spinner</div>:
            courses.length>0?(
                <div>
                <div>
                   <div>
                        <InstructorChart courses={instructorData}/>
                        <div>
                            <p>Statistices</p>
                             <div>
                                <p>Total Courses</p>
                             <p>{courses.length} </p>
                             </div>
                             <div>
                                <p>Total Student</p>
                                <p>{totalStudents} Students</p>
                             </div>
                             <div>
                                <p>Total Income</p>
                                <p>Rs.  {totalAmount} </p>
                             </div>
                        </div>
                    </div>  
                </div>
                {/* Render   coursss */}
                <div>
                    <div>
                        <p>Your Courses</p>
                        <Link to="/dashboard/my-courses">
                            <p>view all</p>
                        </Link>
                    </div>
                    {
                        console.log("my courses sectionis this",courses.slice(0,3))
                    }
                    <div>
                        {
                            courses.slice(0,3).map((course,index)=>{
                                <div className='text-yellow-200'>{course.price}</div>
                            })
                        }
                    </div>
                    <div>
                        {
                            courses.map((course,index)=>{
                                <div>
                                    <img src={course.thumbnail} alt="kfkkfk" />
                                    {course.price}
                                    <div>
                                        <p>{course.courseName}</p>
                                        <div>
                                            <p>{course.studentsEnrolled.length} students</p>
                                            <p>|</p>
                                            <p>Rs. {course.price}</p>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                </div>
            ):(
                <div>
                    <p>You have not created any courses yet</p>
                    <Link to="/dashboard/add-Course">Create a Course</Link>
                </div>
            )
        }
    </div>
  )
}

export default Instructor