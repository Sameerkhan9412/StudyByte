import React from "react";
// import ContactUsForm from "../ContactUsPage/ContactUsForm";
import ContactUsForm from "../"

const ContactFormSection = () => {
  return (
    <div className="mx-auto">
      <h1 className="mx-auto w-11/12 font-bold text-3xl text-center">Get in Touch</h1>
      <p className="text-center mt-4 text-richblack-300 font-medium text-xl mb-10">
        We&apos;d love to here for you, Please fill out this form.
      </p>
      <div className="mt-12 mx-auto">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
