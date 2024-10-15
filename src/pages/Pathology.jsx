import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Slider from "../components/Slider";
import axiosConfig from "../services/axiosConfig";
import { useParams, Link, useNavigate } from "react-router-dom";

const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
function Pathology() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // For loading state
  const [popularTests, setPopularTests] = useState([]);
  const [healthConcerns, setHealthConcerns] = useState([]);
  const [labs, setLabs] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartdata, setCartData] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedCartData = localStorage.getItem("cartData");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedCartData) {
      setCartData(JSON.parse(savedCartData));
    }
  }, []);

  useEffect(() => {
    getPopularTests();
    getHealthConcerns();
    getlabs();
    getPopularPackages();
  }, []);

  const getPopularTests = async () => {
    try {
      const response = await axiosConfig.get(`/lab_tests/popular_tests`);
      setPopularTests(response.data.data); // Set the doctors state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const getHealthConcerns = async () => {
    try {
      const response = await axiosConfig.get(`/health_concerns`);
      setHealthConcerns(response.data.data); // Set the doctors state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const getlabs = async () => {
    try {
      const response = await axiosConfig.get(`/labs`);
      setLabs(response.data.data); // Set the doctors state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const getHealthPackageCategories = async () => {
    try {
      const response = await axiosConfig.get(`/health_package_categories`);
      setHealthPackageCategories(response.data.data); // Set the doctors state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const getPopularPackages = async () => {
    try {
      const response = await axiosConfig.get(`/packages`);
      setPopularPackages(response.data.data); // Set the doctors state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const handleAddToCart = (id, test) => {
    if (!cart.includes(id)) {
      // Add ID to the cart
      const updatedCart = [...cart, id];

      // Add test data to the cart data
      const updatedCartData = [...cartdata, test];

      setCart(updatedCart);
      setCartData(updatedCartData);
      localStorage.removeItem("selectedLab");

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      localStorage.setItem("cartData", JSON.stringify(updatedCartData));

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

  return (
    <Layout>
      {/* Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Slider page="pathology" />
      <section className="pt-0 pb-48">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4">
              <div className="card-fisrt card-width card-img-img">
                <span>Comprehensive Blood Tests</span>
                <h3>Understand Your Health Inside Out</h3>
                {/* <a className="btn-prodcut btn-medi" href="#">
                  Book Now
                  <img src="/img/arrow-black.svg" alt="arrow" />
                </a> */}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-fisrt card-width  card-img-img1">
                <span>Convenient Home Sample Collection</span>
                <h3>Seamless Testing at Your Doorstep</h3>
                {/* <a className="btn-prodcut btn-medi" href="#">
                  Book Now
                  <img src="/img/arrow-black.svg" alt="arrow" />
                </a> */}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-fisrt card-width card-img-img2">
                <span>Rapid COVID-19 Testing</span>
                <h3>Stay Informed and Protected</h3>
                {/* <a className="btn-prodcut btn-medi" href="#">
                  Book Now
                  <img src="/img/arrow-black.svg" alt="arrow" />
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="p-0 mb-100">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="d-flex justify-content-between align-items-center card-flex">
                <div className="d-flex align-items-center">
                  <img src="/img/upload.png" alt="upload" />
                  <span>Upload Prescription</span>
                </div>
                <a className="arrow-w" href="#">
                  <img src="/img/black-arrow.svg" alt="arrow" />
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <Link to="tel:+91 9833873117" style={{ textDecoration: "none" }}>
                <div className="d-flex justify-content-between align-items-center card-flex card-flex-bg">
                  <div className="d-flex align-items-center">
                    <img src="/img/expert.png" alt="expert" />
                    <span style={{ color: "black" }}>Call Our Expert</span>
                    <span className="ms-2 success"> +91 9833873117</span>
                  </div>
                  <a className="arrow-w" href="#">
                    <img src="/img/black-arrow.svg" alt="arrow" />
                  </a>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Package Categories Section  */}
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Popular Tests</span>
                <h2 className="pb-0">Popular Tests</h2>
              </div>
            </div>
          </div>
          {/* Test Cards */}
          <div className="row mb-48 g-4">
            {popularTests &&
              popularTests.slice(0, 6).map((test) => (
                <div className="col-lg-3 d-flex" key={test.id}>
                  <div className="test-main test-main-update w-100">
                    <div className="d-flex mb-20">
                      <div className="img-group">
                        <img
                          className="h-50 img-fluid"
                          src={"/img/blood.svg"}
                          alt={test.name}
                        />
                      </div>
                      <div className="text-total">
                        <h3>{test.name}</h3>
                        <p>Type: {test.type_of_test}</p>
                        <span>Reports in {test.report_time || "24 hrs"}</span>
                      </div>
                    </div>
                    <div className="d-block justify-content-between align-items-center">
                      <div className="tot-price mb-2">
                        {(test.best_price || test.mrp) && (
                          <>
                            <span>Top Deal</span>
                            <div className="price-amount">
                              <p className="mb-0">
                                {/* Show best price if available, otherwise show MRP */}
                                {test.best_price ? (
                                  <span className="pricefix">
                                    ₹{test.best_price}
                                  </span>
                                ) : (
                                  <span className="pricefix">₹{test.mrp}</span>
                                )}

                                {/* Show MRP with a strikethrough if best price is available */}
                                {test.best_price && test.mrp && (
                                  <span className="price-delete">
                                    <del>(₹{test.mrp})</del>
                                  </span>
                                )}

                                {/* Show discount if available */}
                                {test.discount && (
                                  <span className="off">
                                    {" "}
                                    ({test.discount}% off)
                                  </span>
                                )}
                              </p>
                            </div>
                          </>
                        )}
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
              ))}
          </div>

          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <Link
                  className="btn-more btn-load-more"
                  to="/pathology/lab-test"
                >
                  View All
                  <img
                    src="/img/view-arrow.svg"
                    alt="View All"
                    className="ms-2"
                  />
                </Link>

                {cartdata.length > 0 && (
                  <button
                    className="btn-more btn-load-more"
                    onClick={handleLabClick}
                  >
                    View Selected Tests
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Health Tests Section */}
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Popular Health</span>
                <h2 className="pb-0">Tests Based on Your Health Concerns</h2>
              </div>
            </div>
          </div>
          <div className="row g-4 row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-8">
            {healthConcerns.map((concern) => (
              <div
                className="col w-100 d-flex align-items-center"
                key={concern.id}
              >
                <div className="popular-health">
                  <Link
                    to={`/pathology/lab-test/${toSlug(concern.name)}/${concern.id}`}
                    state={{ conID: concern.id }}
                    className="stretched-link"
                  >
                    <div className="health-items">
                      <img
                        src={concern.image_url}
                        className="img-fluid avatar"
                        alt="Diabetes Care"
                      />
                    </div>
                    <h3>{concern.name}</h3>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-60">
                <span className="text-uppercase">OUR LAB PARTNERS</span>
                <h2 className="pb-0">Our Partnered Labs</h2>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="col-xl-4 col-lg-4 col-6 col-sm-4 d-flex"
              >
                <div className="">
                  <div className="partner-logos h-100">
                    <img src={lab.image_url} className="img-fluid" alt="" />
                  </div>
                  {/* <h3>{lab.name}</h3> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Explore Packages</span>
                <h2 className="pb-0">Popular Packages</h2>
              </div>
            </div>
          </div>
          <div className="row mb-48 g-4">
            {popularPackages.slice(0, 12).map((packageData) => (
              <div key={packageData.id} className="col-lg-4 d-flex">
                <div className="test-main w-100">
                  <div className="d-flex mb-20">
                    <div className="img-group">
                      <img
                        src={"/img/checkup.png"}
                        alt={packageData.name}
                        className="img-fluid"
                      />
                    </div>
                    <div className="text-total">
                      <h3>{packageData.name}</h3>
                      <p>Type: {packageData.requirement}</p>
                      {/* Placeholder for other package info, if any */}
                      <span>Reports in 24 hrs</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-16">
                    <div className="tot-price">
                      {packageData.actual_price !==
                        packageData.selling_price && <span>Top Deal</span>}
                      <div className="price-amount">
                        <p className="mb-0">
                          {/* Assuming you have calculated the selling price and discount dynamically */}
                          <span className="pricefix">₹{packageData.mrp}</span>
                          {packageData.actual_price && (
                            <span className="price-delete">
                              <del>(₹{packageData.actual_price})</del>
                            </span>
                          )}
                          {/* Assuming discount calculation */}
                          {packageData.selling_price && (
                            <span className="off">
                              {" "}
                              ₹{packageData.selling_price} (
                              {packageData.discount}% off)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Link
                      className="add-btn"
                      to={`/pathology/packages/details/${toSlug(
                        packageData.name
                      )}`}
                      state={{ packageId: packageData.id }}
                    >
                      View details
                    </Link>
                  </div>
                  <div className="card-footers">
                    <div className="footer-img">
                      <img
                        src={packageData.lab.image_url}
                        alt={packageData.lab.name}
                        className="img-fluid"
                      />
                    </div>
                    <span>By {packageData.lab.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-lg-12 text-center">
              <Link className="btn-more btn-load-more" to="/pathology/packages">
                View All
                <img src="/img/view-arrow.svg" alt="" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container bg-img1 bg-color">
          <div className="row">
            <div className="col-lg-6">
              <div className="book-consultant">
                <h3>Accurate Results, Expert Care, Quick Turnaround</h3>
                <p>
                  Experience peace of mind with our precise lab tests, guided by
                  experienced professionals and delivered swiftly.
                </p>
                <a className="btn-book" href="#">
                  Book Now
                  <img src="/img/black-arrow.svg" alt="" />
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="consultant-img">
                <img className="img-fluid" src="/img/result.png" alt="" />
                <img
                  className="sign-doc img-fluid"
                  src="/img/shap-star.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="card-fisrt card-width trangender monitor">
                <span>Comprehensive Blood Testing</span>
                <h3>Monitor Your Health with Precision</h3>
                <a className="btn-prodcut btn-medi" href="">
                  Book Now
                  <img src="/img/arrow-black.svg" alt="" />
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-fisrt card-width trangender trangender2 advcane-tech">
                <span>Advanced Diagnostic Imaging</span>
                <h3>Get Clear Insights into Your Health</h3>
                <a className="btn-prodcut btn-medi" href="">
                  Book Now
                  <img src="/img/arrow-black.svg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="bg-yellow">
            <div className="row justify-content-between">
              <div className="col-lg-5 border-right position-relative">
                <div className="d-lg-flex align-items-start text-lg-start text-center">
                  <img src="/img/certified.svg" alt="" />
                  <div className="footer-upper">
                    <h4>Certified Safety and Quality</h4>
                    <p>
                      Ensuring peace of mind with our commitment to certified
                      safety and superior quality standards
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4 col-6 mx-auto">
                    <div className="card-footer-img text-center">
                      <img src="/img/book-lab.svg" alt="" />
                      <p>Book lab tests from accredited labs</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-6 mx-auto">
                    <div className="card-footer-img text-center">
                      <img src="/img/book-lab.svg" alt="" />
                      <p>Book lab tests from accredited labs</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-6 mx-auto">
                    <div className="card-footer-img text-center">
                      <img src="/img/book-lab.svg" alt="" />
                      <p>Book lab tests from accredited labs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Pathology;
