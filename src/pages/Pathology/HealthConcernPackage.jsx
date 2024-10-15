import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PathologySidebar from "./PathologySidebar";
import axiosConfig from "../../services/axiosConfig";
import { Link, useParams } from "react-router-dom";
const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
function HealthConcernPackage() {
  const { healthConcern, healthConcernId } = useParams();

  const [loading, setLoading] = useState(true); // For loading state
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [totalPages, setTotalPages] = useState(1); // State for the total number of pages
  const itemsPerPage = 150; // Number of items per page
  const [testName, setTestName] = useState("");

  useEffect(() => {
    getLabPackages(currentPage); // Call API when component mounts or currentPage changes
  }, [currentPage, healthConcernId]);

  const getLabPackages = async (page = 1) => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await axiosConfig.get(
        `/health_concerns/${healthConcernId}/show_packages`,
        {
          params: {
            page: page,
            query: "", // Add a query if needed
          },
        }
      );
      setTestName(response.data.data.name);
      setPackages(response.data.data.packages); // Set the labTests state
      // Calculate total pages based on total items and items per page
      setTotalPages(
        Math.ceil(response.data.data.packages.length / itemsPerPage)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination numbers dynamically
  const renderPagination = () => {
    const maxPageButtons = 5; // Number of page buttons to display
    const pages = [];
    const halfRange = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);

    if (currentPage <= halfRange) {
      end = Math.min(totalPages, maxPageButtons);
    } else if (currentPage + halfRange >= totalPages) {
      start = Math.max(1, totalPages - maxPageButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <li key={i}>
          <a
            href="#"
            className={currentPage === i ? "active-border" : ""}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </a>
        </li>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    ); // Show loader overlay
  }

  return (
    <Layout>
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
                <a href="#">Packages</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      <div className="filter">
        <div className="container">
          <div className="col-lg-12">
            <div className="d-lg-flex align-items-center justify-content-between mb2">
              <div className="heading text-center">
                <h2 className="heading-test pb-0">
                  {testName} Packages{" "}
                  <span className="d-inline-block pb-0">
                    {/* ({packages.length}) */}
                  </span>
                </h2>
              </div>
              {/* <div className="dropdown-btn">
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle col-lg-auto col-12"
                    type="button"
                    id="dropdownMenuButton"
                    data-mdb-dropdown-init
                    data-mdb-ripple-init
                    aria-expanded="false"
                  >
                    <span>
                      <img src="/img/filter.svg" alt="" /> Sort By
                    </span>{" "}
                    <img src="/img/arrow-down-black.svg" alt="" />
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
              </div> */}
            </div>
          </div>
          <div className="row">
            <PathologySidebar />

            <div className="col-lg-9">
              <div className="card-test">
                <div className="row g-4 mb-5">
                  {packages.length === 0 && (
                    <div className="col-lg-12">
                      <div className="text-center">
                        <p>No packages found.</p>
                      </div>
                    </div>
                  )}
                  {packages.map((item) => (
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
                            state={{ packageId: item.id }}
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
                  ))}
                </div>
              </div>
              {/* Pagination */}
              {packages.length > 0 && (
              <div className="row">
                <div className="col-lg-12">
                  <div className="pagination-list">
                    <ul className="list-unstyled d-flex justify-content-center">
                      {/* Previous Button */}
                      <li>
                        <a
                          href="#"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <img src="/img/arrow-left-gray.svg" alt="Previous" />
                        </a>
                      </li>
                      {/* Render Pagination Numbers */}
                      {renderPagination()}
                      {/* Next Button */}
                      <li>
                        <a
                          href="#"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <img src="/img/arrow-right-black-1.svg" alt="Next" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              )}
              {/* End Pagination */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HealthConcernPackage;
