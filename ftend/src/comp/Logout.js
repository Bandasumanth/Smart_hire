import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

const Logout = ({ setUser }) => {
    let navigate = useNavigate();

    useEffect(() => {
        Cookies.remove("user");
        navigate("/");
    }, );

    return <div>Logging out...</div>;
};

export default Logout;
