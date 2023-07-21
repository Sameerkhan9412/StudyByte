import React from 'react'
import { useState } from 'react'
import {Chart,registerables} from 'chart.js';
import { Pie } from 'react-chartjs-2';
Chart.register(...registerables);

const InstructorChart = ({courses}) => {
    const [currChart,setCurrChart]=useState("students");
    // functions to generate random colors
    const getRandomColors=(numColors)=>{
        const colors=[];
        for(let i=0;i<numColors;i++){
            const color=`rgb[${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)}]`;
            colors.push(color);
            console.log("genrated colot is ",color);
        }
        return colors; 
    }

    // create data for chart displaying student info
    const chartDataForStudents={
        labels:courses.map((course)=>course.courseName),
        datasets:[
            {
                data:courses.map((course)=>course.totalStudentsEnrolled),
                backgroundColor:getRandomColors(3),
            }
        ]
    }

    // create data for chart displaying income info
    const chartDataForIncome={
        labels:courses.map((course)=>course.courseName),
        datasets:[
            {
                data:courses.map((course)=>course.totalAmountGenerated),
                backgroundColor:getRandomColors(courses.length),
            }
        ]
    }

    // create opptions 
    const options={

    }




  return (
    <div>
         <p>Visualise</p>
         <div className='flex gap-x-5'>
            <button onClick={()=>setCurrChart("students")}>student</button>
            <button onClick={()=>setCurrChart("income")}>Income</button>
         </div>
         <div>
            <Pie data={currChart==="students"? chartDataForStudents :chartDataForIncome}
            options={options}
            />
         </div>
    </div>
  )
}

export default InstructorChart