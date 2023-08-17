import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";
import Spinner from "../../../common/Spinner";
const Instructor = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);
      // pending
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      // console.log("mt new course ",result);
      // console.log(instructorApiData);
      if (instructorApiData.length) {
        setInstructorData(instructorApiData);
      }
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    getCourseDataWithStats();
  }, []);
  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );
  return (
    <div className="text-white mt-6 relative  ">
      <div className="text-2xl">Hi {user.firstName} 👋</div>
      <p className="text-sm text-richblack-300"> Lets start something new</p>
      {loading ? (
        <Spinner/>
      ) : courses.length > 0 ? (
        <div className=" ">
          <div className="flex   w-[100%] ">
            <InstructorChart courses={instructorData} className="flex"  />
            <div className="w-[20%] max-w-[170px] rounded-lg gap-2 bg-richblack-700 p-2">
              <p className="font-bold text-lg">Statistices</p>
              <div>
                <p className="text-richblack-400 font-semibold">Total Courses</p>
                <p className="font-light text-2xl">{courses.length} </p>
              </div>
              <div>
                <p className="text-richblack-400 font-semibold">Total Student</p>
                <p className="font-light text-2xl">{totalStudents}</p>
              </div>
              <div>
                <p className="text-richblack-400 font-semibold">Total Income</p>
                <p className="font-light text-2xl">Rs. {totalAmount} </p>
              </div>
            </div>
          </div>
          {/* Render   coursss */}
          <div className="mt-4">
            <div className="flex justify-between text-lg">
              <p className="font-bold" >Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-yellow-200 font-bold">view all</p>
              </Link>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-3 rounded-lg gap-4">
              {courses.slice(0,3).map((course, index) => (
                <div className="">
                  <img src={course.thumbnail} alt="hekko" />
                  {course.price}
                  <div>
                    <p>{course.courseName}</p>
                    <div className="flex">
                      <p>{course.studentsEnrolled.length} students</p>
                      <p>|</p>
                      <p>Rs. {course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-lg flex flex-col justify-center items-center ">
          <p className=" ">You have not created any courses yet</p>
          <Link to="/dashboard/add-Course" className="text-yellow-200 border-b-2">Create a Course</Link>
        </div>
      )}
    </div>
  );
};

export default Instructor;
