import React, { useEffect } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'
import { useState } from 'react'
import {BsChevronDown} from "react-icons/bs"
import { AiOutlineMenu,AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai"
import Spinner from './Spinner'

const Navbar = () => {
    // console.log("Printing base url: ",process.env.REACT_APP_BASE_URL);
    const {token} = useSelector( (state) => state.auth );
    const {user} = useSelector( (state) => state.profile );
    const {totalItems} = useSelector( (state) => state.cart )
  const [loading, setLoading] = useState(false)
    const location = useLocation();

    const [subLinks, setsubLinks]  = useState([]);

    const fetchSublinks = async() => {
        try{
            setLoading(true)
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            // console.log("Printing Sublinks result:" , result);
            setsubLinks(result.data.data);
            // console.log(result.data.data)
            setLoading(false)
        }
        catch(error) {
            console.log("Could not fetch the category list");
        }
    }


    useEffect( () => {
        // console.log("PRINTING TOKEN", token);
        fetchSublinks();
    },[] )



    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }
    const showHide=()=>{
        let  navId=document.getElementById("mobileNav");
        let menuBtn=document.getElementById("menuBtn");
        let crossBtn=document.getElementById("crossBtn");
        navId.classList.toggle("hideNav");
        menuBtn.classList.toggle("hideMenuBtn");
        crossBtn.classList.toggle("hideMenuBtn");
    }
  return (
    <div className={`flex h-12 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200 fixed top-0 left-0 right-0 z-50 bg-black`}>
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Image */}
      <Link to="/">
        {/* <img src={logo} width={160} height={32} loading='lazy' margin='10px' /> */}
        <img src={logo} width={120}  loading="lazy" className='max-sm:w-18' />
      </Link>

      {/* Nav Links */}
      <nav className='max-md:visible '>
        <ul className='flex gap-x-6 text-richblack-25 mobile-nav w-[90%]  ' id='mobileNav' >
        {
            NavbarLinks.map( (link, index) => (
                 <li key={index}>
                    {
                        link.title === "Catalog" ? (
                            <>
                            <div className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}>
                                <p>{link.title}</p>
                                <BsChevronDown/>

                                <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]'>

                                <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'>
                                </div>
                                {loading?(
                                    <Spinner/>
                                ):
                                 subLinks.length>0 ? (
                                        subLinks.map( (subLink, index) => (
                                                <Link to={`catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index} className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50'>
                                                    <p>{subLink.name}</p>
                                                </Link>
                                            ) )
                                    ) : (<div>No Courses Found</div>)
                            }
                                </div>


                            </div>
                            </>
                        ) : (
                            <Link to={link?.path}>
                                <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                    {link.title}
                                </p>
                                
                            </Link>
                        )
                    }
                </li>
             ) )
        }
        {/* Login/SignUp/Dashboard */}
        <div className='items-center gap-x-4 max-md:flex flex-col gap-3'>

            {
                user && user?.accountType != "Instructor" && (
                    <Link to="/dashboard/cart" className='relative'>
                        <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                        {
                            totalItems > 0 && (
                                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/login">
                        <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[4px] text-richblack-100">
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup">
                        <button  className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[4px] text-richblack-100">
                            Sign Up
                        </button>
                    </Link>
                )
            }
            {
                token !== null && <ProfileDropDown />
            }
            
        </div>

        </ul>
        <ul className='flex gap-x-6 text-richblack-25 max-md:hidden  ' id='mobileNav' >
        {
            NavbarLinks.map( (link, index) => (
                 <li key={index}>
                    {
                        link.title === "Catalog" ? (
                            <>
                            <div className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}>
                                <p>{link.title}</p>
                                <BsChevronDown/>

                                <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]'>

                                <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'>
                                </div>
                                {loading?(
                                    // <Spinner/>
                                    <div>loading...</div>
                                ):
                                 subLinks.length>0 ? (
                                        subLinks.map( (subLink, index) => (
                                                <Link to={`catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index} className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50'>
                                                    <p>{subLink.name}</p>
                                                </Link>
                                            ) )
                                    ) : (<div>No Courses Found</div>)
                            }
                                </div>


                            </div>
                            </>
                        ) : (
                            <Link to={link?.path}>
                                <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                    {link.title}
                                </p>
                                
                            </Link>
                        )
                    }
                </li>
             ) )
        }
        </ul>
      </nav>


        {/* Login/SignUp/Dashboard */}
        <div className='flex items-center gap-x-4  max-md:hidden'>

            {
                user && user?.accountType != "Instructor" && (
                    <Link to="/dashboard/cart" className='relative'>
                        <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                        {
                            totalItems > 0 && (
                                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/login">
                        <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[4px] text-richblack-100">
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup">
                        <button  className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[4px] text-richblack-100">
                            Sign Up
                        </button>
                    </Link>
                )
            }
            {
                token !== null && <ProfileDropDown />
            }
            
        </div>
        <button className="mr-4 text-2xl md:hidden" onClick={showHide}  >
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" id='menuBtn'  className='text-2xl'  />
          <AiOutlineClose fontSize={24} fill="#AFB2BF" id='crossBtn' className='hideMenuBtn text-3xl'  />
        </button>

      </div>
    </div>
  )
}

export default Navbar
