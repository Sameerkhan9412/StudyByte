import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router";
import { buyCourse } from "../services/operations/StudentFeaturesAPI";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import Error from "./Error";
import RatingStars from "../components/common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { formatDate } from "../services/formatDate";
import CourseDetailsCard from "../components/core/Course/courseDetailsCard";

const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);

  useEffect(() => {
    const getCourseFullDetails = async () => {
      console.log("this is course id", courseId);
      try {
        const result = await fetchCourseDetails(courseId);
        console.log("huuuuu", result);
        setCourseData(result);
        console.log("printing course data", courseData);
      } catch (error) {
        console.log("Could not fetch course details");
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  const [avgReviewCount, setAvgReviewRating] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(null);
  useEffect(() => {
    const count = GetAvgRating(
      courseData?.data?.courseDetails.ratingAndReviews
    );
    setAvgReviewRating(count);
  }, [courseData]);

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  useEffect(() => {
    let lectures = 0;
    Response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [courseData]);

  const [isActive,setIsActive]=useState(Array[0]);
  const handleActive=(id)=>{
    setIsActive(
      // !isActive.includes(id)?isActive.concat(id):isActive.filter((e)=>e!=id);
      setIsActive(
        !isActive.includes(id)
          ? isActive.concat([id])
          : isActive.filter((e) => e != id)
      )
    )
  }

  const handledBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "your are not Logged in",
      text2: "Please login to purchase the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };
  if (loading || !courseData) {
    return <div>Loading</div>;
  }
  if (!courseData.success) {
    return (
      <div>
        {" "}
        <Error />{" "}
      </div>
    );
  }
  const {
    _id: course_Id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData.data?.courseDetails;
  return (
    <div className="flex flex-col  text-white">
      <div className="relative flex  flex-col justify-start">
        <p>{courseName}</p>
        <p>{courseDescription}</p>
        <div>
          <span>{avgReviewCount}</span>
          <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
          <span>{`{${ratingAndReviews.length} reviews}`}</span>
          <span>{`{${studentsEnrolled.length} students enrolled}`}</span>
        </div>

        <div>
          <p>Created By {`${instructor.firstName}`}</p>
        </div>
        <div className="flex gap-x-3">
          <p>Created At {formatDate(createdAt)}</p>
          <p> English</p>
        </div>
        <div>
          {console.log("courselist", courseData)}
          <CourseDetailsCard
            course={courseData?.data?.courseDetails}
            setConfirmationModal={setConfirmationModal}
            handledBuyCourse={handledBuyCourse}
          />
        </div>
      </div>
      <div>
        <p>What you will learn</p>
        <div>{whatYouWillLearn}</div>
      </div>
      <div className="flex gap-x-3">
        <div><p>Course Content:</p>
        </div>
        <div className="flex gap-x-4 justify-between">
          <div>
          <span>{courseContent.length} sections</span>
          <span>{totalNoOfLectures} Lectures</span>
          <span>
            {courseData.data?.totalDuration} total length
          </span>
          </div>
          <div>
            <button onClick={()=>setIsActive([])}>Collapse all Section</button>
          </div>




        </div>
      </div>
      <button
        className="bg-yellow-50 p-6 mt-10"
        onClick={() => handledBuyCourse()}
      >
        Buy Now
      </button>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};
export default CourseDetails;
