import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Register from "./comp/Register";
import Login from "./comp/Login";
import Nav from "./comp/Nav";
import Home from "./comp/Home";
import Addpost from "./comp/Addpost";
import { useEffect, useState } from "react";
import Logout from "./comp/Logout";
import Adminhome from "./comp/Adminhome";
import Cookies from "js-cookie"; // Import js-cookie
import UserHome from "./comp/UserHome";
import JobdetailsbyId from './comp/JobdetailsbyId';
import Edit from "./comp/Edit";
import Userjobdetails from "./comp/Userjobdetails";
import Userapply from "./comp/Userapply";
import AppliedJobs from "./comp/AppliedJobs";
import Adminappliedetails from "./comp/Adminappliedetails";
import Selectedcandiates from "./comp/Selectedcandiates";
import Profile from "./comp/Profile";
import ForgotPasswordModal from "./comp/ForgotPasswordModal";

const App = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

const AppContent = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/signup'];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Nav />}
      <Routes>
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/addpost" element={<Addpost />} />
        <Route path="/adhome" element={<Adminhome />} />
        <Route path="/logout" element={<Logout />} />
        <Route exact path="/jobdetails/:id" element={<JobdetailsbyId />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route exact path="/userjobdetails/:id" element={<Userjobdetails />} />
        <Route path="/userapply/:id/:role" element={<Userapply />} />
        <Route path="/appliedjobs" element={<AppliedJobs />} />
        <Route path="/adminapplieddetails" element={<Adminappliedetails />} />
        <Route path="/selectedcandiates" element={<Selectedcandiates />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/forgotpassword" element={<ForgotPasswordModal/>}/>
      </Routes>
    </>
  );
};

export default App;