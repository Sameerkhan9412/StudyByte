import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import { COURSE_STATUS } from '../../../../utils/constants';
import {FiEdit2} from 'react-icons/fi'
import {AiOutlineDelete} from 'react-icons/ai'
import { deleteCourse } from '../../../../services/operations/courseDetailsAPI';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../slices/courseSlice';

const CoursesTable = ({courses,setcourses}) => {
    const dispatch=useDispatch();
    const {token} =useSelector((state)=>state.auth);
    const [loading,setLoading]=useState(false);
    const [confirmationModel,setConfirmationModel]=useState(null);
    const handlerCourseDelete=async(courseId)=>{
        setLoading(true);
        await deleteCourse({courseId:courseId},token);
        const result=await fetchInstructorCourses(token)
        if(result){
            setCourse(result);
        }
        setConfirmationModel(null);
        setLoading(false);
    }
  return (
    <div>
      <Table>
        <Thead>
            <Tr>
                <Th>Courses</Th>
                <Th>Duration</Th>
                <Th>Price</Th>
                <Th>Actions</Th>
            </Tr>
        </Thead>
        <Tbody>
           {
            courses.length===0 ? (
                <Tr>
                    <Td>No Courses Found</Td>
                </Tr>
            )
            :(
                courses?.map((course)=>(
                    <Tr key={course._id} className="flex gap-x-10 border-richblack-800 p-8">
                        <Td className="flex gap-x-4">
                            <img src={course?.thumbnail} className='h-[150px] w-[220px] rounded-lg object-cover'/>
                            <div className='flex flex-col'>
                                <p>{course.courseName}</p>
                                <p>{course.courseDescription}</p>
                                <p>Created:</p>
                                {
                                    course.status===COURSE_STATUS.DRAFT ? (
                                        <p className='text-pink-50'>DRAFTED</p>
                                    ):
                                    (
                                        <p className='text-yellow-50'>PUBLISHED</p>
                                    )
                                }
                            </div>
                        </Td>
                        <td>
                            ${course.price}
                        </td>
                        <td>
                            <button disabled={loading} 
                            // onClick={()=>navigate()}
                             >EDIT <FiEdit2/>
                             </button>
                            <button disabled={loading} 
                            onClick={()=>{
                                setConfirmationModel({
                                    text1: "Do you wnt to delete this course",
                                    text2: "All the data related to this course will be deleted ",
                                    btn1Text:"Delete" ,
                                    btn2Text:"Cancel",
                                    btn1Handler:!loading ?
                                    ()=>handlerCourseDelete(course._id):(<div>hello</div>),
                                    btn2Handler:loading?()=>setConfirmationModel(null):()=>{},
                                })
                            }
                            }
                             >Delete  <AiOutlineDelete/>
                             </button>
                        </td>
                    </Tr>

                ))
            )
           }
        </Tbody>
      </Table>
      {
        confirmationModel&&<confirmationModel modalData={confirmationModel}/>
      }
    </div>
  )
}

export default CoursesTable