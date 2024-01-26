import React, { useEffect, useState } from "react"
import { useForm, ValidationError } from '@formspree/react';

import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const [state, handleSubmit] = useForm("xoqovbwl");
  if (state.succeeded) {
      return <div className="text-4xl mx-auto text-yellow-25 drop-shadow-md ">Your form is submitted successfully , Thanks for joining us!</div>;
  }

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            className="form-style rounded-md p-1"
            required
          />
        <ValidationError 
        prefix="First Name" 
        field="firstname"
        errors={state.errors}
      />
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            className="form-style p-1 rounded-md"
            required
          />
           <ValidationError 
        prefix="Last Name" 
        field="lastname"
        errors={state.errors}
      />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="lable-style">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="form-style p-1 rounded-md"
          required
        />
        <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
      />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style">
          Phone Number
        </label>

        <div className="flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            <select
              type="text"
              name="countryCode"
              id="countryCode"
              placeholder="Enter first name"
              className="form-style p-1 rounded-md text-richblack-500"
              required
            >
              {CountryCode.map((ele, i) => {
                return (
                  <option key={i} value={ele.code}>
                    {ele.code} -{ele.country}
                  </option>
                )
              })}
            </select>
            <ValidationError 
        prefix="Country Code" 
        field="countryCode"
        errors={state.errors}
      />
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="form-style p-1 rounded-md text-richblack-300"
            />
          </div>
        </div>
        <ValidationError 
        prefix="Phone Number" 
        field="phonenumber"
        errors={state.errors}
      />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="form-style p-1 rounded-md text-richblack-300"
          required
        />
         <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
      />
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
    </form>
  )
}

export default ContactUsForm