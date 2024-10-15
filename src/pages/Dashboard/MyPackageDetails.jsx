import React from "react";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";
import axiosConfig from "../../services/axiosToken";
import { useLocation, useNavigate } from "react-router-dom";

function MyPackageDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {}; // Retrieve the state passed from navigate

  // Check if the test object is defined before rendering the details.
  if (!test) {
    return (
      <Layout>
        <div className="text-center">
          <h4>No Package details available.</h4>
        </div>
      </Layout>
    );
  }

  const {
    appointment_type,
    package: packageDetails,
    lab,
    collect_address = {}, // Provide default empty object to avoid errors
    member,
    price_details,
    included_test = [], // Provide default empty array to avoid errors
    razorpay_booking_id,
    payment_type,
    booking_date,
    status,
    id, // assuming id is the package booking id
  } = test;

  // Function to handle cancel action
  const handleCancelPackage = async () => {
    // Confirmation before proceeding with cancellation
    const confirmCancel = window.confirm("Are you sure you want to cancel this package?");
    
    if (confirmCancel) {
      try {
        // API call to cancel the package
        const response = await axiosConfig.put(`/bookings/${id}/cancel_package_booking`);
        
        if (response.status === 200) {
          alert("Package booking has been canceled successfully.");
          navigate("/dashboard/package-tests"); // Redirect back to package list after cancellation
        } else {
          alert("Failed to cancel the package booking.");
        }
      } catch (error) {
        console.error("Error canceling the package:", error);
        alert("An error occurred while canceling the package. Please try again.");
      }
    }
  };

  return (
    <Layout>
      <nav data-mdb-navbar-init className="navbar navbar-expand-lg shadow-none bg-white detail-y">
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
                <a href="#">Package Details</a>
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
                <div className="personal-info mb-4">
                  <h3>Package Tests</h3>
                  <span className="text-muted">Below are the details</span>
                </div>

                {/* Main Details Section */}
                <div className="d-flex justify-content-between">
                  {/* Left Section */}
                  <div className="left-details w-100">
                    {/* Test Details */}
                    <div className="test-details-card p-3 mb-4 bg-light rounded">
                      <div className="d-flex">
                        <img
                          src={lab.image_url}
                          alt={lab.name}
                          style={{ width: "80px", height: "80px" }}
                          className="rounded-circle me-3"
                        />
                        <div>
                          <h5 className="fw-bold">{packageDetails.name} (FBS)</h5>
                          <p className="mb-0">
                            <span className="badge bg-info text-dark">
                              Type: {packageDetails.test_type}
                            </span>{" "}
                            | Reports in 24 hrs
                          </p>
                          <p className="mb-0">Selected Lab: {lab.name}</p>
                          <p className="mb-0">Test Type: {appointment_type}</p>
                          <p className="mb-0">
                            Date & Time: {new Date(booking_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Test Requirements */}
                    <div className="test-requirements mb-4">
                      <h5>Test Requirements</h5>
                      <p>Overnight fasting (10-12 Hours)</p>
                    </div>

                    {/* Test Includes */}
                    <div className="test-include mb-4">
                      <h5>Test Include</h5>
                      <ul>
                        {included_test.map((testItem, index) => (
                          <li key={index}>{testItem}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Collect Location */}
                    {collect_address && collect_address.address ? (
                      <div className="collect-location mb-4 d-flex justify-content-between align-items-center">
                        <div>
                          <h5>Collect Location</h5>
                          <p>{collect_address.address}</p>
                        </div>
                        {/* <button className="btn btn-outline-primary">Edit</button> */}
                      </div>
                    ) : (
                      <div className="collect-location mb-4 d-flex justify-content-between align-items-center">
                        <div>
                          <h5>Collect Location</h5>
                          <p>No address provided</p>
                        </div>
                        {/* <button className="btn btn-outline-primary">Edit</button> */}
                      </div>
                    )}

                    {/* Patient Details */}
                    <div className="patient-details">
                      <h5>Patient Details</h5>
                      <p>
                        {member.name} <span className="badge bg-success">{member.gender}, {member.age}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="right-details ms-3">
                    {/* Price Details */}
                    <div className="price-details mb-4 p-3 bg-light rounded">
                      <h5>Price Details</h5>
                      <div className="d-flex justify-content-between">
                        <p>Labtest Fee</p>
                        <p>₹{price_details.total}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Platform Fee</p>
                        <p>₹{price_details.platform_fees}</p>
                      </div>
                      <div className="d-flex justify-content-between fw-bold">
                        <p>Total Pay</p>
                        <p>₹{price_details.total}</p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="booking-details p-3 bg-light rounded">
                      <h5>Booking Details</h5>
                      <p>Booking ID: #{razorpay_booking_id}</p>
                      <p>Payment: {payment_type}</p>
                      <p>Booking Date: {new Date(booking_date).toLocaleDateString()}</p>
                      <p>Status: {status}</p>
                      {/* if status is cancelled dont show this button */}
                    { status !== "cancelled" ? (
                         <button className="btn btn-outline-danger w-100 mt-2" onClick={handleCancelPackage}>
                         Cancel Package
                       </button>
                      ) : (
                        ""
                      )}
                     
                    </div>
                  </div>
                </div>
                {/* End of Details Section */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyPackageDetails;
