import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectRef = useRef(null); // Create a ref for the select element

  const userId = localStorage.getItem("userid");
  const userName = localStorage.getItem("userName");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("doctors"); // Default to doctors

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    navigate("/login");
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    if (searchText.trim() === "") {
      setInputFocused(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Change selected category
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;

    // Navigate to the search results page and pass the query and category as URL parameters
    navigate(
      `/search-results?category=${selectedCategory}&query=${searchText}`
    );
  };

  const handleReset = () => {
    setSearchText(""); // Clear search text
    setInputFocused(false); // Remove focus from input
  };

  const handleInputMouseDown = () => {
    // If user clicks on the placeholder, focus the input
    setInputFocused(true);
  };

  return (
    <>
      <div className="wrapper">
        <div className="topbar">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-xl-5 py-lg-0 py-3">
                <div className="call d-lg-flex text-lg-start text-lg-center text-start align-items-center">
                  <div className="d-lg-flex align-items-center gap-2s pe-lg-3 mb-lg-0 mb-1">
                    <img src="/img/call.svg" alt="call" />
                    <a href="tel:+919833873117" className="text-white">
                      +919833873117
                    </a>
                    <span className="text-white">&nbsp;/&nbsp;</span>
                    <a href="tel:+919907433098" className="text-white">
                      +919907433098
                    </a>
                  </div>
                  <div className="d-lg-flex align-items-center gap-2s">
                    <img src="/img/mail.svg" alt="mail" />
                    <span className="text-white">
                      <a
                        href="mailto:customer@niramayasoul.com"
                        className="text-white"
                      >
                        customer@niramayasoul.com
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-xl-7 justify-content-lg-end d-lg-flex align-items-center">
                <div className="download-app text-lg-start text-center">
                  <span>Download App</span>
                  <Link
                    to={'https://play.google.com/store/search?q=niramayasoul&c=apps&hl=en'}
                    target="_blank"
                  >
                    <img src="/img/playstore.svg" alt="Play Store" />
                  </Link>
                  <a href="https://apps.apple.com/in/app/niramaya-soul/id6529532848">
                    <img src="/img/iosstore.svg" alt="iOS Store" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header>
        <nav className="navbar navbar-expand-lg navbar-light shadow-none">
          <div className="container">
            <Link className="navbar-brand" reloadDocument to="/">
              <img src="/img/logo.png" alt="logo" />
            </Link>
            <button
              data-mdb-collapse-init
              className="navbar-toggler"
              type="button"
              data-mdb-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <img src="/img/burgericon.svg" alt="" />
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav m-auto">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/" ? "selected" : ""
                    }`}
                    to="/" reloadDocument
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link reloadDocument
                    className={`nav-link ${
                      location.pathname.startsWith("/doctors") ? "selected" : ""
                    }`}
                    to="/doctors"
                  >
                    Doctor
                  </Link>
                </li>
                <li className="nav-item">
                  <Link reloadDocument
                    className={`nav-link ${
                      location.pathname.startsWith("/pharmacy")
                        ? "selected"
                        : ""
                    }`}
                    to="/pharmacy"
                  >
                    Pharmacy
                  </Link>
                </li>
                <li className="nav-item">
                  <Link reloadDocument
                    className={`nav-link ${
                      location.pathname.startsWith("/wellness")
                        ? "selected"
                        : ""
                    }`}
                    to="/wellness"
                  >
                    Wellness
                  </Link>
                </li>
                <li className="nav-item">
                  <Link reloadDocument
                    className={`nav-link ${
                      location.pathname.startsWith("/pathology")
                        ? "selected"
                        : ""
                    }`}
                    to="/pathology"
                  >
                    Pathology
                  </Link>
                </li>
                <li className="nav-item">
                  <Link reloadDocument
                    className={`nav-link ${
                      location.pathname === "/prep-pep" ? "selected" : ""
                    }`}
                    to="/prep-pep"
                  >
                    PrEP-PEP
                  </Link>
                </li>
                <li className="nav-item">
                  <Link reloadDocument
                    className={`nav-link ${
                      location.pathname === "/hiv-art" ? "selected" : ""
                    }`}
                    to="/hiv-art"
                  >
                    HIV-ART/HRT
                  </Link>
                </li>
                <li className="nav-item">
                  <Link reloadDocument
                    className={`nav-link ${
                      location.pathname === "/enquiry" ? "selected" : ""
                    }`}
                    to="/enquiry"
                  >
                    Enquiry
                  </Link>
                </li>
              </ul>
              <div className="cart d-flex align-items-center">
                <div className="icons">
                  <Link to={"/cart"} reloadDocument>
                    <img src="/img/cart.svg" alt="cart" />
                  </Link>
                  <Link to={"/dashboard/my-notifications"}>
                    <img src="/img/notification.svg" alt="cart" />
                  </Link>
                </div>
                <div className="mb-0 position-relative">
                  {userId ? (
                     <div className="dropdown">
                     <button
                       className="btn-user d-flex align-items-center border-0"
                       onClick={toggleDropdown}
                       aria-expanded={dropdownOpen}
                     >
                       <img className="me-2" src="/img/user.svg" alt="user" />
                       
                       <img
                         className="ms-2"
                         src="/img/arrowdown.svg"
                         alt="dropdown"
                         style={{ cursor: "pointer" }}
                       />
                     </button>
               
                     {/* Show the dropdown menu only when it's open */}
                     {dropdownOpen && (
                       <div className="dropdown-menu show mt-2 w-100 leftr">
                         <Link className="dropdown-item" to="/dashboard">
                           <img src="/img/user.svg" alt="Dashboard" className="me-2" />
                           Profile
                         </Link>
                         <Link to={'/logout'}
                           className="dropdown-item btn-logout d-flex align-items-center"
                           
                         >
                           <img src="/img/logout.svg" alt="Logout" className="me-2" />
                           Logout
                         </Link>
                       </div>
                     )}
                   </div>
                  ) : (
                    <Link className="btn-user" to="/login">
                      <img className="me-8" src="/img/user.svg" alt="user" />
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="header-menu">
  <div className="container">
    <div className="row g-3">
      {/* Category Dropdown */}
      <div className="col-lg-2">
        <div className="menu-dropdown">
          <div className="dropdown dropdown-h">
            <div className="position-relative">
              <img
                className="iconburger"
                src="/img/burgericon.svg"
                alt="category"
              />
              <select
                className="toggle d-flex align-items-center justify-content-between w-100"
                onChange={handleCategoryChange}
                ref={selectRef} // Reference to the select element
                onClick={() => selectRef.current.focus()} // Focus on select when clicked
              >
                <option value="doctors">Doctors</option>
                <option value="medicines">Medicines</option>
                <option value="lab_tests">Lab Tests</option>
                <option value="packages">Packages</option>
              </select>
              <img
                className="arrowd"
                src="/img/arrowdown.svg"
                alt="dropdown"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="col-lg-10">
        <div className="searchbar">
          <div className="position-relative w-100">
            {/* Input field */}
            <input
              type="text"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              placeholder="Search for Doctors, Clinic, Disease, and Medicines"
              value={searchText}
              id="search" // Ensure you have an ID for targeting in JavaScript if needed
              onKeyDown={(e) => {
                if (e.key === "Enter") { // Check if Enter key is pressed
                  e.preventDefault(); // Prevent default form submission if inside a form
                  handleSearch(); // Call the search function
                }
              }}
            />
            {/* Placeholder text */}
            {/* {!inputFocused && !searchText && (
              <div
                className="pla"
                onClick={handleInputFocus}
                style={{ cursor: "pointer" }}
              >
                <p>
                  {" "}
                  Search for{" "}
                  <span style={{ color: "green" }}>
                    Doctors, Clinic, Disease, and Medicines
                  </span>
                </p>
              </div>
            )} */}
          </div>
          {/* Search button */}
          <button onClick={handleSearch}>
            <img src="/img/search.svg" alt="search" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  );
}

export default Header;
