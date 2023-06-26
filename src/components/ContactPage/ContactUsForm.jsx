import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiConnector";
import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, issSubmitSuccessful },
  } = useForm();
  const submitContactForm = async (data) => {
    console.log("loging data",data)
    try{
      setLoading(true);
      // const response=await apiConnector("POST",contactusEndpoints.CONTACT_US_API,data);
      const response={status:"ok"};
      console.log("logging response",response);
      setLoading(false);
    }
    catch(error){
      console.log("error: ",error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (issSubmitSuccessful) {
      reset(
        {
          email: "",
          firstname: "",
          lastname: "",
          message: "",
          phoneNo: "",
        },
        [reset, issSubmitSuccessful]
      );
    }
  });

  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-14">
      <div className="flex gap-5">
        {/* firstname */}
        <div className="flex flex-col">
          <label htmlFor="firstname">first name</label>
          <input
            type="text"
            name="firstName"
            id="firstname "
            placeholder="Enter first name"
            className="text-black"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && <span>Please enter your first name</span>}
        </div>
        {/* lastname */}
        <div className="flex flex-col">
          <label htmlFor="lastname">last name</label>
          <input
            type="text"
            name="lastName"
            id="lastname "
            placeholder="Enter last name"
            className="text-black"
            {...register("firstname")}
          />
        </div>
      </div>
        {/* email */}
        <div className=" flex flex-col">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            className="text-black"
            {...register("email", { required: true })}
          />
          {errors.email && <span>Please enter your email address</span>}
        </div>
        {/* phone no */}
        <div className="flex flex-col">  
          <label htmlFor="phonenumber">Phone Number</label>
          <div className="flex flex-row gap-1">
            {/* dropdown */}
              <select name="dropdown" id="dropdown" className="bg-yellow-50 w-[80px] " 
              {...register("countrycode ",{required:true})}>
                {
                  CountryCode.map((element,index)=>(
                    <option key={index} value={element.code} className="bg-richblack-400">
                      {element.code} : {element.country}
                    </option>
                  ))
                }
              </select>
              <input type="number" name="phonenumber" id="phonenumber" placeholder="12345 67890" className="text-black w-[100%]" 
              {...register(("phoneNo"),
                {
                  required:{value:true,message:"Please enter Phone Number"},
                  maxLength:{value:10,message:"invalid Phone Number"}
                })
              } />
              {
                errors.phoneNo&&(
                  <span>
                    {
                      errors.phoneNo.message
                    }
                  </span>
                )
              }
            </div>
        </div>
        {/* message */}
        <div className="flex flex-col">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            placeholder="Enter your message here"
            cols="30"
            rows="7"
            className="text-black w-[cal(100%-90px)]"
            {...register("message", { required: true })}
          />
          {errors.message && <span>Please enter your message</span>}
        </div>
    <button type="submit" className="rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black">
      send message
    </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
