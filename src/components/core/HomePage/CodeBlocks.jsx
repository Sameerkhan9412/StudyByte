import React from 'react'
import CTAButton from "../HomePage/Button"
import HighlightText from './HighlightText'
import {FaArrowRight} from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroudGradient, codeColor
}) => {
  return (
    // <div className={`flex ${position} my-20 justify-between gap-1`}>
    <div className={`flex ${position} flex-col justify-between gap-5 my-auto w-[100%]`}>

      
    {/*Section 1*/}
    <div className=' flex flex-col gap-8 w-[100%] md:w-[50%] '>
        {heading}
        <div className='text-richblack-300 font-bold '>
            {subheading}
        </div>

        {/* <div className='flex gap-7 mt-7'> */}
        <div className='flex gap-7 my-4'>
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                <div className='flex gap-2 items-center'>
                    {ctabtn1.btnText}
                    <FaArrowRight/>
                </div>
            </CTAButton>

            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>  
                    {ctabtn2.btnText}
            </CTAButton>
        </div>


    </div>

     {/*Section 2*/}
     <div className=' h-fit flex text-[12px] w-[100%] py-4 md:w-[45%] lg:w-[500px] relative bg-richblack-800 rounded-md shadow-[0px_3px_12px_10px_#fffff0]'> 
     <div className=' '></div>
     <div className='h-[90px] w-[90px]  rounded-full absolute right-32 shadow-[8px_1px_100px_6px_#dbe500] animate-pulse  '></div>
        <div className='text-center flex flex-col w-[10%] text-richblack-300 font-inter font-bold z-10 md:text-[12px] lg:text-[15px] '>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
        </div>

        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 z-10 md:text-[12px] lg:text-[15px] ` }>
           <TypeAnimation
            sequence={[codeblock, 3000, ""]}
            repeat={Infinity}
            cursor={true}
           
            style = {
                {
                    whiteSpace: "pre-line",
                    display:"block",
                }
            }
            omitDeletionAnimation={true}
           />
        </div>

     </div>


    </div>
  )
}

export default CodeBlocks
