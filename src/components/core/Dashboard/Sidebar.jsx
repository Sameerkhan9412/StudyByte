import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";


export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="custom-loader"></div>
      </div>
    )
  }
  const ShowOrHideSideBar=()=>{
    let navigateIconLeft=document.getElementById("NavigateLeftBtn").classList;
    let navigateIconRight=document.getElementById("NavigateRightBtn").classList;
    let SideBar=document.getElementById("dashboardSidebar").style;
    // navigateIconLeft.replace("visible","hidden")
    if(navigateIconLeft=="visible"){
      navigateIconLeft.replace("visible","hidden");
      navigateIconRight.replace("hidden","visible");
      SideBar.width="50px";
    }
    else{
      navigateIconLeft.replace("hidden","visible");
      navigateIconRight.replace("visible","hidden");
      SideBar.width="220px";
    }
    
  }

  return (
    <>
      <div className="flex overflow-auto  flex-col border-r-[4px] border-r-richblack-700 bg-richblack-800 py-10 relative overflow-x-hidden transition-all" id="dashboardSidebar" >
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" id="SideBar"/>
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
        <button className="text-white text-4xl absolute bottom-2 right-2"  onClick={ShowOrHideSideBar}>
            <FaAngleDoubleLeft id="NavigateLeftBtn" className="visible" />
            <FaAngleDoubleRight id="NavigateRightBtn" className="hidden" />
          </button>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}