import React, { useEffect, useState } from "react";
import axiosConfig from "../../services/axiosToken";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";
import { useNavigate } from "react-router-dom";

function MyLabTest() {
  const navigate = useNavigate();
  const [labTests, setLabTests] = useState([]);
  const [visibleTests, setVisibleTests] = useState(5); // Default to show 5 lab tests
  const [labTestType, setLabTestType] = useState("home_collect_sample"); // Default to home collection

  // Function to fetch lab tests based on the selected type
  const fetchLabTests = async (type) => {
    const endpoint =
      type === "home_collect_sample"
        ? "/lab_test_bookings/home_collect_sample"
        : "/lab_test_bookings/visit_lab"; // Change the API based on selection

    try {
      const response = await axiosConfig.get(endpoint);
      setLabTests(response.data.data);
    } catch (error) {
      console.error("Error fetching the lab tests: ", error);
    }
  };

  useEffect(() => {
    // Fetch lab tests initially for the default selected type
    fetchLabTests(labTestType);
  }, [labTestType]);

  // Handle dropdown change to trigger different API calls
  const handleLabTestTypeChange = (event) => {
    setLabTestType(event.target.value);
    setVisibleTests(5); // Reset visible tests when switching types
  };

  // Load more lab tests by increasing visible count
  const handleLoadMore = () => {
    setVisibleTests((prev) => prev + 5); // Show 5 more lab tests
  };

  const handleViewDetails = (test) => {
    // Handle view details logic here
    navigate("/dashboard/lab-test-details", { state: { test: test } });
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
                <a href="#">Lab Tests</a>
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
                    <h3>Lab Tests</h3>
                    <span>Below are the details</span>
                  </div>
                  <div className="form-group mt-3" style={{ width: "200px" }}>
                    <select
                      className="form-select"
                      value={labTestType}
                      onChange={handleLabTestTypeChange}
                    >
                      <option value="home_collect_sample">Home Collection</option>
                      <option value="visit_lab">Visit Lab</option>
                    </select>
                  </div>
                </div>

                {/* Lab Tests List */}
                <div className="lab-test-list">
                  {labTests.length > 0 ? (
                    labTests
                      .slice(0, visibleTests) // Show only the visible number of lab tests
                      .map((test, index) => (
                        <div key={index} className="lab-test-item p-3 mb-3 lab-test-box">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-start">
                              <img
                                src={test.lab.image_url}
                                alt={test.lab.name}
                                className="rounded-circle me-3"
                                style={{ width: "60px", height: "60px" }}
                              />
                              <div>
                                <p className="mb-1 fw-bold">Lab: {test.lab.name}</p>
                                {test.lab_test_booking_items.length > 0 ? (
                                  <>
                                    <p className="mb-1 fw-bold">
                                      Test: {test.lab_test_booking_items[0].lab_test.name}
                                    </p>
                                    <p className="mb-1">
                                      Type: {test.lab_test_booking_items[0].lab_test.type_of_test}
                                    </p>
                                    <p className="mb-1">
                                      Date & Time: {test.lab_test_booking_items[0].date_slot}, {test.lab_test_booking_items[0].time_slot}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-muted mb-1">No lab test items</p>
                                )}
                                <p className="text-muted mb-1">
                                  Appointment Type:{" "}
                                  {test.appointment_type === "home_collect_sample"
                                    ? "Home Sample Collection"
                                    : "Visit Lab"}
                                </p>
                                <p className="text-muted mb-1">
                                  Collection Address: {test.collect_address?.address}
                                </p>
                              </div>
                            </div>

                            <div className="d-flex flex-column text-end">
                              {/* Status Badge */}
                              <span
                                className={`badge ${getStatusBadgeClass(
                                  test.status
                                )} mb-2`}
                              >
                                {test.status.toUpperCase()}
                              </span>

                              <p className="mb-1">Price Details</p>
                              <p className="mb-1 text-muted">
                                Total MRP: ₹{test.price_details.total_mrp || "N/A"}
                              </p>
                              <p className="mb-1 text-muted">
                                Platform Fees: ₹{test.price_details.platform_fees || "N/A"}
                              </p>
                              <p className="mb-1 text-muted">
                                Total Price: ₹{test.price_details.total_price || "N/A"}
                              </p>
                              <button className="btn btn-outline-success" onClick={() => handleViewDetails(test)}>View Details</button>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>No lab tests found.</p>
                  )}
                </div>

                {/* Load More Button */}
                {visibleTests < labTests.length && (
                  <div className="text-center mt-3">
                    <button className="btn btn-primary buttonCustom" onClick={handleLoadMore}>
                      Load More
                    </button>
                  </div>
                )}
                {/* End of Lab Tests List */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyLabTest;
