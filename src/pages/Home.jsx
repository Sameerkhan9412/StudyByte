import React from 'react'
import {FaArrowRight} from "react-icons/fa"
import {Link} from "react-router-dom"
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import ReviewSlider from '../components/common/ReviewSlider'
import laptopImg from '../assets/Images/laptop_img.png'
const Home = () => {
  return (
    <div className='mt-9'>
      {/*Section1  */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center 
      text-white justify-between'>

        <Link to={"/signup"} className='mt-[40px]'>
            <div className=' group p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 hover:scale-95 w-fit'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                transition-all duration-200 group-hover:bg-richblack-900  '>
                    <p> Become an Instructor</p>
                    <FaArrowRight />
                </div>
            </div>

        </Link>

        <div className='text-center font-semibold mt-7 text-2xl md:text-4xl'>
            Empower Your Future with
            <HighlightText text={"Coding Skills"} />
        </div>

        <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>

        <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}> 
                Learn More
            </CTAButton>

            <CTAButton active={false} linkto={"/login"}> 
                Book a Demo
            </CTAButton>
        </div>
        <div>
           
        </div>
        <div className=' drop-shadow-2xl w-[499px]  my-8 relative max-sm:w-[300px] '>
            <img src={laptopImg} alt="" className='  ' />
            <video
            muted
            loop
            autoPlay className=' absolute top-4 right-[49px]   w-[400px] -z-10 max-sm:w-[230px] max-sm:top-3 max-sm:right-[35px]'>
            <source src={Banner}/>
            </video>
        </div>

        {/* Code Section 1 */}
        <div className='my-6'>
            <CodeBlocks 
                position={"md:flex-row items-center "}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock Your
                        <HighlightText text={"coding potential"}/>
                        with our online courses
                    </div>
                }
                subheading = {
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText: "try it yourself",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "learn more",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<ahref="/">Header</a>\n</body>\n</html>`}
                codeColor={"text-yellow-25"}
            />
        </div>

                {/* Code Section 2 */}
        <div>
            <CodeBlocks 
                position={"md:flex-row-reverse items-center"}
                heading={
                    <div className='text-4xl font-semibold '>
                        Start 
                        <HighlightText text={"coding in "}/>
                        <br/>
                        <HighlightText text={"seconds"}/>
                    </div>
                }
                subheading = {
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText: "try it yourself",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "learn more",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`import React from "react";\n import CTAButton from "./Button";\n import TypeAnimation from "react-type";\n import {FaArrowRight} from "react-icons/fa";\n \n const Home=()=>{\n return (\n <div> Home  </div>\n )\n }`}
                codeColor={"text-yellow-25"}
            />
        </div>

            <ExploreMore />
      </div>

      {/*Section 2  */}
      <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='h-[333px] homepage_bg'>

                <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                    <div className='h-[250px]'></div>
                    <div className='text-white flex gap-7 '>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex gap-2 items-center' >
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                            
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div className='flex items-center'>
                                Learn more
                            </div>
                        </CTAButton>
                    </div>

                </div>


            </div>

            <div className='w-11/12 mx-auto flex max-w-maxContent flex-col items-center justify-between gap-7'>

                <div className='flex flex-row gap-10 mb-10 mt-[100px] max-sm:flex-col w-[90%] max-sm:mt-[30px]'>
                    <div className=' font-semibold w-[45%] text-4xl max-sm:w-[100%]'>
                        Get the Skills you need for a
                        <HighlightText text={"Job that is in demand"} />
                    </div>

                    <div className='flex flex-col gap-8 w-[40%] items-start max-sm:w-[100%] text-center'>
                    <div className='text-[16px]'>
                    The modern StudyByte is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    </div>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn more
                        </div>
                    </CTAButton>
                    </div>

                </div>
                
                

                <TimelineSection />

                <LearningLanguageSection />

            </div>

            

      </div>


      {/*Section 3 */}
      <div className='w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>

            <InstructorSection />

            {/* Review Slider here */}
      </div>

            <ReviewSlider/>

      {/*Footer */}
      <Footer />

    </div>
  )
}

export default Home
