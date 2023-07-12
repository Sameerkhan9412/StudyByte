import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { getCatalogPageData } from '../services/PageAndComponentsData';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import Footer from '../components/common/Footer'
import { categories } from '../services/apis';

const Catalog = () => {
  
  const {catalogName} =useParams();
  const [catalogPageData,setCatalogPageData]=useState(null);
  const [categoryId,setCategoryId]=useState("");

  // fetch alll categories
  useEffect(()=>{
    const getCategories=async()=>{
      const res=await apiConnector("GET",categories.CATEGORIES_API)
      console.log("this is respnsoe of catalog",res)
      const cateogory_id=res?.data?.data.filter((ct)=> ct.name.split(" ").join("-").toLowerCase()===catalogName)[0]._id;
      setCategoryId(cateogory_id);
    }
    getCategories();
  },[catalogName])
  
  useEffect(()=>{
    const getCategoriesDetails=async()=>{
      try {
        console.log("hoooooooooooooooo")
        console.log("my category id is ".categoryId);
        const res = await getCatalogPageData(categoryId)
        setCatalogPageData(res)
      } catch (error) {
        console.log(error);
      }
    }
    getCategoriesDetails();
  },[categoryId]);


  return (
    <div className='text-white'>
      <div>
        <p>{`Home/Catalog/`}
        <span></span></p>
        <p></p>
        <p></p>
      </div>
      <div>
        {/* section 1 */}
        <div>
        <div className='flex gap-x-3'>
          <p>Most Popular</p>
          <p>New</p>
        </div>

        </div>
      {/* section 2 */}
      <div>
        <p>Top Courses</p>
        <div>
          {/* <CourseSlider/> */}
        </div>
      </div>
      {/* section 3 */}
      <div>
        <p>Frequently Bought Together</p>
      </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Catalog