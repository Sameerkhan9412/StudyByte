import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/ContactUsPage/ContactDetails"
import ContactForm from "../components/ContactUsPage/ContactForm"
import ReviewSlider from "../components/common/ReviewSlider"
import ContactMap from "../components/ContactUsPage/ContactMap"


const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
        {/* Contact Map */}

      </div>
      <div className="w-11/12 mx-auto text-white my-8 max-w-maxContent  overflow-hidden">
        <ContactMap />
      </div>
      <div className="relative mx-auto  my-20 flex w-11/12  max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider/>
      </div>
      <Footer />
    </div>
  )
}

export default Contact