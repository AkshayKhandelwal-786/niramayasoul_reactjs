import React, { useEffect, useState } from "react";
import axiosConfig from "../../services/axiosToken";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";
import { useNavigate } from "react-router-dom";

function MyPackageTest() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [visiblePackages, setVisiblePackages] = useState(5); // Default to show 5 package tests
  const [packageTestType, setPackageTestType] = useState("package_home_collect_sample"); // Default to home collection

  // Function to fetch package tests based on the selected type
  const fetchPackageTests = async (type) => {
    const endpoint =
      type === "package_home_collect_sample"
        ? "/bookings/package_home_collect_sample"
        : "/bookings/package_visit_lab"; // Change the API based on selection

    try {
      const response = await axiosConfig.get(endpoint);
      setPackages(response.data.data); // Assuming 'data' contains the array of package tests
    } catch (error) {
      console.error("Error fetching the package tests: ", error);
    }
  };

  useEffect(() => {
    // Fetch package tests initially for the default selected type
    fetchPackageTests(packageTestType);
  }, [packageTestType]);

  // Handle dropdown change to trigger different API calls
  const handlePackageTestTypeChange = (event) => {
    setPackageTestType(event.target.value);
    setVisiblePackages(5); // Reset visible packages when switching types
  };

  // Load more package tests by increasing visible count
  const handleLoadMore = () => {
    setVisiblePackages((prev) => prev + 5); // Show 5 more package tests
  };

  const handleViewDetails = (test) => {
    // Handle view details logic here
    navigate("/dashboard/package-test-details", { state: { test: test } });
  };

  // Function to get the badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "completed":
        return "badge-primary";
      case "cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  return (
    <Layout>
      <nav
        data-mdb-navbar-init
        className="navbar navbar-expand-lg shadow-none bg-white detail-y"
      >
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb gap-3">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li>/</li>
              <li className="breadcrumb-item">
                <a href="#">Dashboard</a>
              </li>
              <li>/</li>
              <li className="breadcrumb-item">
                <a href="#">Package Tests</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>
      <section className="py-dashboard">
        <div className="container">
          <div className="row">
            <Sidebar />
            <div className="col-lg-9">
              <DashboardSubHeader />
              <div className="p-info">
                <div className="personal-info d-flex justify-content-between">
                  <div>
                    <h3>Package Tests</h3>
                    <span>Below are the details</span>
                  </div>
                  <div className="form-group mt-3" style={{ width: "200px" }}>
                    <select
                      className="form-select"
                      value={packageTestType}
                      onChange={handlePackageTestTypeChange}
                    >
                      <option value="package_home_collect_sample">Home Collection</option>
                      <option value="package_visit_lab">Visit Lab</option>
                    </select>
                  </div>
                </div>

                {/* Package Tests List */}
                <div className="lab-test-list">
                  {packages.length > 0 ? (
                    packages
                      .slice(0, visiblePackages) // Show only the visible number of package tests
                      .map((test, index) => (
                        <div key={index} className="lab-test-item p-3 mb-3 lab-test-box">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-start">
                              <img
                                src={test.lab.image_url || "/img/lab-test.svg"}
                                alt={test.lab.name}
                                className="rounded-circle me-3"
                                style={{ width: "60px", height: "60px" }}
                              />
                              <div>
                                <p className="mb-1 fw-bold">{test.package.name}</p>
                                <p className="mb-1">
                                  Test Type: {test.package.test_type}
                                </p>
                                <p className="text-muted mb-1">Selected Lab: {test.lab.name}</p>

                                {/* Different display for home collection and lab visit */}
                                {test.appointment_type === "home collect sample" ? (
                                  <p className="text-muted mb-1">
                                    Collection Address: {test.collect_address.address}
                                  </p>
                                ) : (
                                  <p className="text-muted mb-1">
                                    Lab Location: {test.lab_location.address}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="d-flex flex-column">
                              {/* Status Badge */}
                              <span
                                className={`badge ${getStatusBadgeClass(
                                  test.status
                                )} mb-2`}
                              >
                                {test.status.toUpperCase()}
                              </span>

                              <p className="mb-1">Appointment Type</p>
                              <p className="mb-1 text-muted">
                                {test.appointment_type === "home collect sample"
                                  ? "Home Sample Collect"
                                  : "Visit Lab"}
                              </p>
                              <p className="mb-1">Date & Time</p>
                              <p className="mb-1 text-muted">
                                {test.date_slot}, {test.time_slot}
                              </p>
                              <button className="btn btn-outline-success" onClick={() => handleViewDetails(test)}>View Details</button>
                            </div>
                          </div>
                          <div>
                            <p className="mt-2">
                              <strong>Tests included:</strong>
                            </p>
                            <ul>
                              {test.included_test.map((includedTest, i) => (
                                <li key={i}>{includedTest}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>No package tests found.</p>
                  )}
                </div>

                {/* Load More Button */}
                {visiblePackages < packages.length && (
                  <div className="text-center mt-3">
                    <button className="btn btn-primary buttonCustom" onClick={handleLoadMore}>
                      Load More
                    </button>
                  </div>
                )}
                {/* End of Package Tests List */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyPackageTest;
