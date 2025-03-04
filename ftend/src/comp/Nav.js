import { Link } from "react-router-dom";
import "../comp/Nav.css";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


const Nav = () => {
  let [f,setF]=useState("/")



  const [user, setUser] = useState(() => {
    const storedUser = Cookies.get("user");
    return storedUser ? JSON.parse(storedUser) : {};
    
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const checkUser = () => {
      const storedUser = Cookies.get("user");
      setUser(storedUser ? JSON.parse(storedUser) : {});
    };

    const interval = setInterval(checkUser, 500);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to={f}><div className="navbar-logo" style={{color:"#0d5de7"}}><i class="fa-brands fa-slack" style={{color: "#0d5de7"}}></i> Smart-Hire</div></Link>
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <span className="navbar-toggle-icon"></span>
        </button>
        <nav className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          {user?.token && user?.role === "admin" && (
            <Link to="/adhome" className="navbar-link" onClick={toggleMenu}>Home</Link>
          )}
          {user?.token && user?.role === "admin" && (
            <Link to="/addpost" className="navbar-link" onClick={toggleMenu} > Post Job</Link>
          )}
          {user?.token && user?.role === "admin" && (
            <Link to="/adminapplieddetails" className="navbar-link" onClick={toggleMenu}>Applications Received</Link>
          )}
          {user?.token && user?.role === "admin" && (
            <Link to="/selectedcandiates" className="navbar-link" onClick={toggleMenu}>Candidates Status</Link>
          )}
          {user?.token && user?.role === "user" && (
            <Link to="/userhome" className="navbar-link" onClick={toggleMenu}>Jobs</Link>
          )}
          {user?.token && user?.role === "user" && (
            <Link to="/appliedjobs" className="navbar-link" onClick={toggleMenu}>Applied Jobs</Link>
          )}
        </nav>
        <div className="navbar-buttons">
          {!user?.token && <Link to="/signup" className="navbar-button register-btn">Signup</Link>}
          {!user?.token && <Link to="/login" className="navbar-button login-btn">Login</Link>}
          {user?.token && (
            <>
              <Avatar sx={{ bgcolor: deepPurple[500] }}>
                {user?.firstName?.charAt(0)?.toUpperCase() || ""}
                {user?.lastName?.charAt(0)?.toUpperCase() || ""}
              </Avatar>
              <Link to="/logout" className="navbar-button logout-btn">Logout</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;