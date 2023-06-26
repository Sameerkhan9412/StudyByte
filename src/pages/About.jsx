import React from 'react'
import HighLightText from "../components/core/HomePage/HighlightText";
import bannerImg1 from "../assets/Images/aboutus1.webp";
import bannerImg2 from "../assets/Images/aboutus2.webp";
import bannerImg3 from "../assets/Images/aboutus3.webp";
import Quote from '../components/core/AboutPage/Quote';
import  FoundingStory from "../assets/Images/FoundingStory.png"
import StatsComponent from '../components/core/AboutPage/StatsComponents';
import LearningGrid from '../components/core/AboutPage/LearningGrid';
import ContactFormSection from '../components/core/AboutPage/ContactFormSection';
import Footer from "../components/common/Footer";
const About = () => {
  return (
    <div className='flex flex-col items-center justify-between text-white mt-[100px] w-11/12 max-w-maxContent mx-auto '>
        {/* section 1 */}
        <section>
            <div>
            <header>
                Driving Innovation in Online Education for a 
                <HighLightText text={"Brighter Future"}/>
                <p>Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>
            </header>
            <div className='flex flex-row justify-center gap-x-3 mx-auto '>
                  <img src={bannerImg1} alt="" />
                  <img src={bannerImg2} alt="" />
                  <img src={bannerImg3} alt="" />
                </div>
            </div>
        </section>
        {/* section 2 */}
        <section>
          <div>
            <Quote/>
          </div>
        </section>
        {/* section 3 */}
        <section>
          <div className="flex flex-col ">
              {/* founding story wala div */}
            <div className="flex">
                {/* founding story left box */}
              <div className="">
                <h1>Our Founding Story</h1>
                <p>Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>

                    <p>As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
              </div>
                {/* founding story right box */}
              <div className="">
                <img src={FoundingStory} alt="" />
              </div>
            </div>

            {/* vision and mission wala parent div */}
            <div className="flex">
              {/* left box */}
              <div className="">
                <h1>Our Vision</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint aliquid repellat similique ut odit ipsam voluptatibus alias, magnam inventore molestiae, deleniti nihil assumenda quia quisquam. Non dolore placeat voluptatum omnis?</p>
              </div>
              {/* right box */}
              <div className="">
                <h1>Our Misson</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint aliquid repellat similique ut odit ipsam voluptatibus alias, magnam inventore molestiae, deleniti nihil assumenda quia quisquam. Non dolore placeat voluptatum omnis?</p>
              </div>
            </div>
          </div>
        </section>
        {/* section 4 */}
        <StatsComponent/>
        {/* section 5 */}
        <section className=''>
         <LearningGrid/>
        </section>
        {/* section 6 */}
        <section>
          <ContactFormSection/>
        </section>
        {/* section 7 */}
        <section>
          <div className='my-[30px]'>
            <h1 className='text-2xl'>
            Review from other learners
            </h1>
          </div>
        </section>
        <Footer/>
    </div>
  )
}

export default About