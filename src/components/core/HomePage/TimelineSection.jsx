import React from 'react'

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        Description:"Students will always be our top priority",
    },
    {
        Logo: Logo3,
        heading: "Solve the problem",
        Description:"The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        heading: "Leadership",
        Description:"Code your way to a solution",
    },
];

const TimelineSection = () => {
  return (
    <div>
      <div className='flex flex-row gap-15 items-center max-sm:flex-col-reverse'>

        <div className='w-[45%] flex flex-col gap-5 my-4 max-sm:w-[90%] mx-auto'>
            {
                timeline.map( (element, index) => {
                    return (
                        <div className='flex gap-5' key={index}>

                            <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                <img src={element.Logo} />
                            </div>

                            <div>
                                <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                <p className='text-base'>{element.Description}</p>
                            </div>

                        </div>
                    )
                } )
            }
        </div>
        <div className='overflow-hidden rounded-md shadow-[1px_1px_3px_6px_#e2e8f0]'>
            
            <img src={timelineImage} alt='timelineImage' className='h-fit shadow-lg shadow-pure-greys-400 object-cover max-w-[400px] transition-all hover:scale-125' />

         </div>

        </div>

      </div>
  )
}

export default TimelineSection
