import React from "react";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";
import axiosConfig from "../../services/axiosToken";
import { useLocation } from "react-router-dom";

const LabTestDetails = () => {
  const location = useLocation();
  const { test } = location.state || {}; // Retrieve the state passed from navigate

  // Check if the test object is defined before rendering the details.
  if (!test) {
    return (
      <Layout>
        <div className="text-center">
          <h4>No lab test details available.</h4>
        </div>
      </Layout>
    );
  }

  const {
    id,
    appointment_type,
    razorpay_booking_id,
    platform_fee,
    status,
    payment_type,
    booking_date,
    lab,
    collect_address,
    member,
    price_details
  } = test;

  const handleCancelBooking = async () => {
    const isConfirmed = window.confirm("Are you sure you want to cancel this lab test?");
    if (isConfirmed) {
      try {
        const response = await axiosConfig.put(`/lab_test_bookings/${id}/cancel_booking`);
        if (response.status === 200) {
          alert("Lab test booking has been successfully canceled.");
        } else {
          alert("Failed to cancel the booking. Please try again.");
        }
      } catch (error) {
        console.error("Error canceling the lab test booking:", error);
        alert("An error occurred while canceling the booking. Please try again later.");
      }
    } else {
      // User clicked cancel on the confirmation dialog, no action will be taken.
      alert("Cancellation process aborted.");
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
                <a href="#">Lab Test Details</a>
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
                <div className="personal-info mb-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h3>Lab Tests</h3>
                    <span className="text-muted">Below are the details</span>
                  </div>
                </div>

                {/* Main Details Section */}
                <div className="d-flex justify-content-between">
                  {/* Left Section */}
                  <div className="left-details">
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
                          <h5 className="fw-bold">Fasting Blood Sugar (FBS)</h5>
                          <p className="mb-0">
                            <span className="badge bg-info text-dark">Type: Test, Fasting Required</span> | Reports in 24
                            hrs
                          </p>
                          <p className="mb-0">Selected Lab: {lab.name}</p>
                          <p className="mb-0">Test Type: {appointment_type}</p>
                          <p className="mb-0">Date & Time: {new Date(booking_date).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Test Requirements */}
                    <div className="test-requirements mb-4">
                      <h5>Test Requirements</h5>
                      <p>Overnight fasting (10-12 Hours)</p>
                    </div>

                    {/* Test Include */}
                    <div className="test-include mb-4">
                      <h5>Test Include</h5>
                      <ul>
                        <li>Blood Glucose Fasting</li>
                        <li>HbA1C</li>
                        <li>Kidney Function Test</li>
                      </ul>
                    </div>

                    {/* Collect Location */}
                    <div className="collect-location mb-4 d-flex justify-content-between align-items-center">
                      <div>
                        <h5>Collect Location</h5>
                        <p>{collect_address.address}</p>
                      </div>
                      {/* <button className="btn btn-outline-primary">Edit</button> */}
                    </div>

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
                        <p>₹{price_details.total_mrp}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Platform Fee</p>
                        <p>₹{price_details.platform_fees}</p>
                      </div>
                      <div className="d-flex justify-content-between fw-bold">
                        <p>Total Pay</p>
                        <p>₹{price_details.total_price}</p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="booking-details p-3 bg-light rounded">
                      <h5>Booking Details</h5>
                      <p>Booking ID: #{id}</p>
                      <p>Payment: {payment_type}</p>
                      <p>Booking Date: {new Date(booking_date).toLocaleDateString()}</p>

                      {/* if status is cancelled no need to show  */}
                      {status !== "cancelled" && (
                        <button className="btn btn-outline-danger w-100 mt-2" onClick={handleCancelBooking}>
                        Cancel Labtest
                      </button>
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
};

export default LabTestDetails;
