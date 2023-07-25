import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "../HomePage/Button"
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-16'>
      <div className='flex gap-20 items-center max-sm:flex-col-reverse md: flex-row'>

        <div className='h-1/2  max-sm:w-[100%]  md:w-[50%]    '>
            <img
                src={Instructor}
                alt=""
                className='object-cover shadow-lg w-[50%] mx-auto '
            />
        </div>

        <div className='w-[50%] flex flex-col gap-10 max-sm:w-[100%] text-center '>
            <div className='text-4xl font-semobold'>
                Become an
                <HighlightText text={"Instructor"} />
            </div>

            <p className='text-[16px] font-semibold text-richblack-300 w-[80%] max-sm:text-1xl w-[100%] mx-auto'>
            Instructors from around the world teach millions of students on StudyByte. We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex gap-2 items-center max-sm:gap-1'>
                        Start Learning Today
                        <FaArrowRight />
                    </div>
                </CTAButton>
            </div>


        </div>

      </div>
    </div>
  )
}

export default InstructorSection
