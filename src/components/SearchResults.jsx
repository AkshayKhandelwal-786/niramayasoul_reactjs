import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "../services/axiosConfig";
import Layout from "./Layout";
const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
function SearchResults() {
  const navigate = useNavigate();

  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cart, setCart] = useState([]);
  const [cartdata, setCartData] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedCartData = localStorage.getItem("cartData");

    if (savedCart) {
      setCart(JSON.parse(savedCart));

    }
    if(savedCartData) {
      setCartData(JSON.parse(savedCartData));
    }

  }, []);

  const handleAddToCart = (id, test) => {
    if (!cart.includes(id)) {
      // Add ID to the cart
      const updatedCart = [...cart, id];

      // Add test data to the cart data
      const updatedCartData = [...cartdata, test];

      setCart(updatedCart);
      setCartData(updatedCartData);

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      localStorage.setItem("cartData", JSON.stringify(updatedCartData));
      localStorage.removeItem("selectedLab");

      console.log(`Item with id: ${id} added to the cart`);
    } else {
      console.log(`Item with id: ${id} is already in the cart`);
    }
  };

  const handleRemoveFromCart = (id) => {
    // Remove ID from the cart
    const updatedCart = cart.filter((item) => item !== id);
  
    // Remove the specific test data from cartData using the id
    const updatedCartData = cartdata.filter((item) => item.id !== id);
  
    setCart(updatedCart);
    setCartData(updatedCartData);
    localStorage.removeItem("selectedLab");

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartData", JSON.stringify(updatedCartData));
  
    console.log(`Item with id: ${id} removed from the cart`);
  };
  
  const handleLabClick = () => {
    navigate("/pathology/lab-test/cart");
    //setIsModalOpen(true);
  };
  // Extract category and query from the URL parameters
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const query = queryParams.get("query");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      let apiUrl = "";
      let params = {};

      // Dynamically set API URL and parameters based on the category
      switch (category) {
        case "doctors":
          apiUrl = "/doctors";
          params = { query };
          break;
        case "medicines":
          apiUrl = "/medicines";
          params = { page: 1, query };
          break;
        case "lab_tests":
          apiUrl = "/lab_tests";
          params = { page: 1, query };
          break;
        case "packages":
          apiUrl = "/packages";
          params = { page: 1, query };
          break;
        default:
          break;
      }

      try {
        const response = await axios.get(apiUrl, { params });
        setResults(response.data.data || []);
      } catch (error) {
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [category, query]);

  // const handleAddToCart = (testId, test) => {
  //   setCart([...cart, testId]);
  // };

  // const handleRemoveFromCart = (testId) => {
  //   setCart(cart.filter((id) => id !== testId));
  // };

  const renderMedicineCard = (medicine) => {
    if (!medicine || !medicine.id || !medicine.name) {
      return null; // Do not render if medicine details are missing
    }

    return (
      <div className="col" key={medicine.id}>
                <div className="h-100 d-flex flex-column">
                  {" "}
                  {/* Ensure the card takes equal height */}
                  <Link
                    to={`/pharmacy/product/${toSlug(medicine.name)}`}
                    state={{ piD: medicine.id }}
                  >
                    <div className="prduct-card pharmacy-image">
                      <img
                        className="img-fluid w-100"
                        src={medicine.images[0]}
                        alt={medicine.name}
                      />
                    </div>
                  </Link>
                  <div className="product-dis flex-grow-1 d-flex flex-column">
                    <span>{medicine.brand.name}</span>
                    <p>{medicine.name}</p>
                    <div className="price mt-auto">
                    <p>
                        ₹{medicine?.new_price || medicine?.approx_mrp}
                        {medicine?.new_price && (
                          <span>
                            <del> MRP ₹{medicine?.approx_mrp}</del>
                          </span>
                        )}
                      </p>                    </div>
                    <Link
                      className="cart-btn mt-auto"
                      to={`/pharmacy/product/${toSlug(medicine.name)}`}
                      state={{ piD: medicine.id }}
                    >
                      <img src="/img/btnc.svg" alt="Add to cart" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
    );
  };

  const renderLabTestCard = (test) =>
    !test || !test.id || !test.name ? null : (
      <div className="col-lg-3 d-flex" key={test.id}>
                  <div className="test-main test-main-update w-100">
                    <div className="d-flex mb-20">
                      <div className="img-group">
                        <img
                          className="h-50 img-fluid"
                          src={test.labs[0]?.image_url || "/img/blood.svg"}
                          alt={test.name}
                        />
                      </div>
                      <div className="text-total">
                        <h3>{test.name}</h3>
                        <p>Type: {test.type_of_test}</p>
                        <span>Reports in {test.report_time}</span>
                      </div>
                    </div>
                    <div className="d-block justify-content-between align-items-center">
                      <div className="tot-price mb-2">
                        <span>Top Deal</span>
                        <div className="price-amount">
                          <p className="mb-0">
                            <span className="pricefix">₹{test.best_price}</span>
                            <span className="price-delete">
                              <del>(₹{test.mrp})</del>
                            </span>
                            <span className="off">
                              {" "}
                              ₹{(test.mrp - test.best_price).toFixed(2)} OFF
                            </span>
                          </p>
                        </div>
                      </div>
                      {cart.includes(test.id) ? (
                        <button
                          className="buttonCustomAdd bg-dangers w-100"
                          onClick={() => handleRemoveFromCart(test.id)}
                        >
                          Remove Test
                        </button>
                      ) : (
                        <button
                          className="add-btn buttonCustomAdd w-100"
                          onClick={() => handleAddToCart(test.id, test)}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
    );

  const renderPackageCard = (item) =>
    // check item have data or not
    !item || !item.id || !item.name ? null : (
      <div className="col-lg-4 d-flex" key={item.id}>
      <div className="test-main w-100">
        <div className="d-flex mb-20">
          <div className="img-group">
            {/* Dynamically load image from API response or a fallback image */}
            <img
               src={"/img/checkup.png" || item.image_url}
              alt={item.name}
              className="img-fluid"
            />
          </div>
          <div className="text-total">
            {/* Dynamic Package Name */}
            <h3>{item.name}</h3>
            {/* Example Requirement or description - Update based on real data */}
            <p>
              {item.requirement || "Includes various tests"}
            </p>
            {/* Assuming report time is static; update as needed */}
            <span>Reports in 24 hrs</span>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-16">
          <div className="tot-price">
            {/* Display "Top Deal" only if there's a discount */}
            {item.mrp !== item.selling_price && (
              <span>Top Deal</span>
            )}
            <div className="price-amount">
            <p className="mb-0">
                                {/* Dynamic Pricing: Show selling price and MRP if different */}
                                <span className="pricefix">
                                  ₹{item.selling_price || item.actual_price}
                                </span>
                                {item.actual_price &&
                                  item.selling_price &&
                                  item.actual_price !== item.selling_price && (
                                    <>
                                      <span className="price-delete">
                                        <del>(₹{item.actual_price})</del>
                                      </span>
                                      {/* <span className="off">
                                        ₹
                                        {item.discount}% off
                                        OFF
                                      </span> */}
                                    </>
                                  )}
                              </p>
            </div>
          </div>
          {/* Add button - implement logic as needed */}
          <Link
            className="add-btn"
            to={`/pathology/packages/details/${toSlug(
              item.name
            )}`}
            state={{ packageId : item.id }}
          >
            View Details
          </Link>
        </div>
        <div className="card-footers">
          <div className="footer-img">
            {/* Dynamic Lab Image */}
            <img
              src={
                item.lab.image_url || "/img/round-health.png"
              }
              alt={item.lab.name}
              className="img-fluid"
            />
          </div>
          {/* Dynamic Lab Name */}
          <span>By {item.lab.name || "Partnered Lab"}</span>
        </div>
      </div>
    </div>
    );

  const renderDoctorCard = (doctor) =>
    // check item have data or not
    !doctor || !doctor.id || !doctor.first_name ? null : (
      <div className="col d-flex flex-column h-100" key={doctor.id}>
                {" "}
                {/* Ensure each column has equal height */}
                <div className="prduct-card card-radius image-product">
                  <img
                    className="img-fluid w-100"
                    src={doctor.image_url || "/img/default-doctor.png"}
                    alt={doctor.name || "Doctor Image"}
                    style={{ objectFit: "cover", height: "250px" }}
                  />
                </div>
                <div className="product-dis d-flex flex-column flex-grow-1">
                  {" "}
                  {/* Main content area */}
                  <div className="d-flex justify-content-between align-items-start">
                    <span className="hair">
                      {doctor.specialities
                        .map((speciality) => speciality.name)
                        .join(", ")}
                    </span>
                    <label className="rating">
                      <img src="/img/rating.svg" alt="rating" />
                      {doctor.rating}
                    </label>
                  </div>
                  {/* These sections should grow to fill the space */}
                  <div className="flex-grow-1" style={{ height: "70px" }}>
                    <p className="name">{doctor.address.name}</p>
                    <div className="degignation">
                      <span>{doctor.education}</span>
                    </div>
                  </div>
                  <div className="location d-flex justify-content-between">
                    <span>
                      <img src="/img/map.svg" alt="location" />
                      {doctor.location}
                    </span>
                    <p className="doc-price d-flex p-0 m-0">
                      <span>₹</span>
                      {doctor.fee}
                    </p>
                  </div>
                  {/* Ensure buttons are aligned consistently at the bottom */}
                  <div className="mt-auto d-flex flex-column">
                    {" "}
                    {/* Updated to push buttons to the bottom */}
                    <Link
                      className="cart-btn mb-2"
                      to={`/doctors/profile/${toSlug(doctor.address.name)}`}
                      state={{ doctorId: doctor.id }}
                    >
                      <img src="/img/video.svg" alt="Online Consult" />
                      Online Consult
                    </Link>
                    <Link
                      className="cart-btn btn-clinic mb-0"
                      to={`/doctors/profile/${toSlug(doctor.address.name)}`}
                      state={{ doctorId: doctor.id }}
                    >
                      <img src="/img/clinic.svg" alt="Visit Clinic" />
                      Visit Clinic
                    </Link>
                  </div>
                </div>
              </div>
    );

  return (
    <Layout>
      <div className="container my-4">
        <h1 className="text-center mb-4">Search Results</h1>
        <p className="text-center text-muted">
          <strong>Category:</strong> {category} | <strong>Query:</strong> "
          {query}"
        </p>

        {/* Loading and Error States */}
        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {error && <p className="alert alert-danger text-center">{error}</p>}

        {/* Search Results */}
        {!loading && results.length > 0 ? (
          <>
          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4 mb-70">
            {category === "medicines" &&
              results.map((medicine) => renderMedicineCard(medicine))}
            </div>
            <div className="row mb-48 g-4">
            {category === "lab_tests" && (
              <>
                {cartdata.length > 0 && (
                  <div className="col-12 text-center mb-4">
                    <button
                    className="btn-more btn-load-more"
                    onClick={handleLabClick}
                    >
                      View Selected Tests
                    </button>
                  </div>
                )}
                {results.map((test) => renderLabTestCard(test))}
              </>
            )}
            </div>
             <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4 mb-70">

            {category === "packages" &&
              results.map((packageItem) => renderPackageCard(packageItem))}
              </div>

              <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">

            {category === "doctors" &&
              results.map((doctor) => renderDoctorCard(doctor))}

            {/* Add more render functions for other categories like doctors and packages */}
          </div>
          </>
        ) : (
          !loading && (
            <p className="text-center mt-4">No results found for {query}.</p>
          )
        )}
      </div>
    </Layout>
  );
}

export default SearchResults;
