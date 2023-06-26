import "./App.css";
import {Route, Routes } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgetPassword from "./pages/ForgetPassword";
import UpdataPassword from "./pages/UpdataPassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Sidebar from "./components/core/Dashboard/Sidebar";
import MyProfile from "./components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { Error } from "./pages/Error";
function App() {
  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route path="forgot-password" 
        element={<OpenRoute>
          <ForgetPassword/> 
           </OpenRoute>}
           />
        <Route path="update-password/:id" 
        element={<OpenRoute>
          <UpdataPassword/>
           </OpenRoute>}
           />
        <Route path="verify-email" 
        element={<OpenRoute>
          <VerifyEmail/>
           </OpenRoute>}
           />
        <Route path="/contact"  element={<Contact/>}/>
        <Route path="/about"  element={<About/>}/>
        <Route element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }>
        <Route path="dashboard/my-profile" element={<MyProfile/>}/>
        {/* <Route path="dashboard/settings" element={<Settings/>}/> */}
          </Route>
        <Route path="*" element={<Error/>}/>
    </Routes>

   </div>
  );
}

export default App;
