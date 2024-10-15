import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Or use useHistory in older versions

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user-related data from localStorage or sessionStorage
    // localStorage.removeItem("token");  // Assuming you're storing the token
    localStorage.removeItem("userid");

    // Redirect to login or home page
    navigate("/login"); // You can change this to home page or dashboard

  }, [navigate]);

  return (
    <div className="text-center">
      <h2>Logging out...</h2>
    </div>
  );
}

export default Logout;
