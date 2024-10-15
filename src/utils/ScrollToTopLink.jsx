import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ScrollToTopLink = ({ to, children, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault(); // Prevent default link behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });
    
    // Use React Router's navigation after forcing the scroll
    navigate(to);
  };

  return (
    <a href={to} {...props} onClick={handleClick}>
      {children}
    </a>
  );
};

export default ScrollToTopLink;
