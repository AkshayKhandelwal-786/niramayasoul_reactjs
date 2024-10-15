import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PathologySidebar from "./PathologySidebar";
import axiosConfig from "../../services/axiosConfig";
import LabListModel from "./LabListModel";
import { useNavigate } from "react-router-dom";

function Labtest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [labTests, setLabTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [maxPageButtons, setMaxPageButtons] = useState(3);
  const [cart, setCart] = useState([]);
  const [cartdata, setCartData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getLabTests(currentPage);
  }, [currentPage]);

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

    // Remove test data from cart data
    const updatedCartData = cartdata.filter((item) => item.id !== id);

    setCart(updatedCart);
    setCartData(updatedCartData);
    localStorage.removeItem("selectedLab");

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartData", JSON.stringify(updatedCartData));

    console.log(`Item with id: ${id} removed from the cart`);
  };

  const getLabTests = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosConfig.get(`/lab_tests`, {
        params: {
          page: page,
          query: "", // Add a query if needed
        },
      });

      setLabTests(response.data.data);
      setTotalPages(response.data.data.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const halfRange = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);

    if (currentPage <= halfRange) {
      end = Math.min(totalPages, maxPageButtons);
    } else if (currentPage + halfRange >= totalPages) {
      start = Math.max(1, totalPages - maxPageButtons + 1);
    }

    for (let i = start; i < end; i++) {
      pages.push(
        <li key={i}>
          <a
            href="#"
            className={currentPage == i ? "active-border" : ""}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </a>
        </li>
      );
    }

    return pages;
  };

  const handleLabClick = () => {
    navigate("/pathology/lab-test/cart");
    //setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb Section */}
      <nav
        data-mdb-navbar-init
        className="navbar navbar-expand-lg shadow-none breadcrumb-main bg-white py-0"
      >
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li>
                <img src="/img/arrow-right-gray.svg" alt="icon" />
              </li>
              <li className="breadcrumb-item">
                <a href="#">Pathology</a>
              </li>
              <li>
                <img src="/img/arrow-right-gray.svg" alt="icon" />
              </li>
              <li
                className="breadcrumb-item active-bradcurmb"
                aria-current="page"
              >
                <a href="#">Test</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      {/* Lab Tests and Filter Section */}
      <div className="filter">
        <div className="container">
          <div className="col-lg-12">
            <div className="d-lg-flex align-items-center justify-content-between mb2">
              <div className="heading text-center">
                <h2 className="heading-test pb-0">
                  Tests{" "}
                  <span className="d-inline-block pb-0">
                    {/* ({labTests.length}) */}
                  </span>
                </h2>
              </div>
              <div className="dropdown-btn d-flex align-items-center justify-content-between">
                <div className="dropdown d-flex align-items-center">
                  {/* Show only if cart has items */}
                  {cartdata.length > 0 && (
                    <button
                      className="btn btn-primary labbtn px-4 mr-3"
                      onClick={handleLabClick}
                    >
                      View Selected Tests
                    </button>
                  )}

                  <div className="dropdown">
                    <button
                      className="btn btn-primary dropdown-toggle ps-3 ms-3"
                      type="button"
                      id="dropdownMenuButton"
                      data-mdb-dropdown-init
                      data-mdb-ripple-init
                      aria-expanded="false"
                    >
                      <span>
                        <img src="/img/filter.svg" alt="Sort By" /> Sort By
                      </span>
                      <img src="/img/arrow-down-black.svg" alt="Arrow" />
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Listings */}
          <div className="row">
            <PathologySidebar />
            <div className="col-lg-9">
              <div className="card-test">
                <div className="row g-4 mb-5">
                  {labTests.map((test) => (
                    <div className="col-lg-4 d-flex" key={test.id}>
                      <div className="test-main test-main-update w-100">
                        <div className="d-flex mb-20">
                          <div className="img-group">
                            <img src="/img/blood.svg" alt={test.name} />
                          </div>
                          <div className="text-total">
                            <h3>{test.name}</h3>
                            <p>{test.type_of_test || "N/A"}</p>
                            <span>
                              Reports in{" "}
                              {test.report_time
                                ? `${test.report_time} hrs`
                                : "24 hrs"}
                            </span>
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
                                      <span className="pricefix">
                                        ₹{test.mrp}
                                      </span>
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
                              className="buttonCustomAdd w-100 bg-dangers"
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
              </div>

              {/* Pagination */}
              <div className="pagination-list">
                <ul className="list-unstyled d-flex justify-content-center">
                  <li>
                    <a
                      href="#"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <img src="/img/arrow-left-gray.svg" alt="Previous" />
                    </a>
                  </li>
                  {renderPagination()}
                  {totalPages > 1 && (
                    <li>
                      <a
                        href="#"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <img src="/img/arrow-right-black-1.svg" alt="Next" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LabListModel isOpen={isModalOpen} onClose={handleCloseModal} />
    </Layout>
  );
}

export default Labtest;
