import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
// Icons
import { FaStar } from "react-icons/fa";
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper";

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      if (data?.success) {
        setReviews(data?.data);
      }
    })();
  }, []);

  // console.log(reviews)

  return (
    <div className="relative  my-20 flex flex-col w-11/12 max-w-maxContent mx-auto  items-center justify-between gap-8 bg-richblack-900 text-white">
      <h2 className="font-semibold text-4xl text-center  text-white">
        Review from Other Learners
      </h2>
      <div className="max-h-max max-w-maxContent flex items-center px-4">
        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          loop={true}
          freeMode={true}
          breakpoints={ {
            // when window width is <= 499px
            640: {
                slidesPerView: 2,
                spaceBetweenSlides: 50
            },
            // when window width is <= 999px
            768: {
                slidesPerView: 3,
                spaceBetweenSlides: 50
            },
            // when window width is <= 999px
            1024: {
                slidesPerView: 4,
                spaceBetweenSlides: 50
            }
        }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }
        
        }
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-screen "
        >
          {reviews.map((review, i) => (
            <SwiperSlide
              key={i}
              className="bg-richblack-800 p-2 text-sm rounded-md mx-4 h-[150px] flex flex-col border-b-2 border-l-2 justify-center shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
            >
              <div className="flex items-center gap-2  ">
                <img
                  src={
                    review?.user?.image
                      ? review?.user?.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt="profile Pic"
                  className="h-9 w-9 object-cover rounded-full"
                />
                <div>
                  <p className="">{`${review?.user?.firstName} ${review?.user?.lastName}`}</p>
                  <p className="text-richblack-600 font-bold">
                    {review?.course?.courseName}
                  </p>
                </div>
              </div>
              <p>
                {review?.review.split(" ").length > truncateWords
                  ? `${review?.review
                      .split(" ")
                      .slice(0, truncateWords)
                      .join(" ")} ...`
                  : `${review?.review}`}
              </p>
              <p className="font-semibold text-yellow-100">
                {review.rating.toFixed(1)}
              </p>
              <ReactStars
                count={5}
                value={review.rating}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaStar />}
                fullIcon={<FaStar />}
              />
            </SwiperSlide>
          ))}
          {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
