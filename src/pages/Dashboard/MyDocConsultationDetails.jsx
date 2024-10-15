import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosConfig from "../../services/axiosToken"; // Assuming you have axios setup
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";

function MyDocConsultationDetails() {
  const { state } = useLocation();
  const { consultation } = state;
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Function to handle the cancellation of the appointment
  const handleCancelAppointment = async () => {
    // Basic confirmation prompt
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return; // If user cancels the confirmation, stop execution

    try {
      // Assuming the consultation id is part of the consultation object
      const response = await axiosConfig.put(`/bookings/${consultation.id}/cancel_appointment`);
      
      // Notify the user about successful cancellation
      alert("Your appointment has been successfully cancelled.");

      // Navigate back to the doctor consultation list or dashboard
      navigate("/dashboard/doctor-consults");

    } catch (error) {
      // Notify the user in case of an error
      alert("Failed to cancel the appointment. Please try again later.");
    }
  };

  return (
    <Layout>
      <nav className="navbar navbar-expand-lg shadow-none bg-white detail-y">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb gap-3">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li>/</li>
              <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
              <li>/</li>
              <li className="breadcrumb-item"><a href="#">Doctor Consultation</a></li>
            </ol>
          </nav>
        </div>
      </nav>

      <section className="py-dashboard consultation-details-section">
        <div className="container">
          <div className="row">
            <Sidebar />
            <div className="col-lg-9">
              <DashboardSubHeader />
              <div className="p-info consultation-details-wrapper">
                <div className="personal-info mb-4">
                  <h2 className="section-title">Doctor Consultation</h2>
                  <span className="section-subtitle">Below are the details</span>
                </div>

                <div className="row">
                  <div className="col-lg-8">
                    {/* Doctor Information */}
                    <div className="card mb-4 doctor-card shadow-sm rounded">
                      <div className="card-body">
                        <h4 className="card-title">Doctor Details</h4>
                        <div className="d-flex align-items-center">
                          <img
                            src={consultation.doctor.image}
                            alt={consultation.doctor.name}
                            className="doctor-img rounded-circle"
                          />
                          <div className="ml-3">
                            <h5 className="doctor-name">{consultation.doctor.name}</h5>
                            <p className="doctor-speciality">
                              {consultation.doctor.specialities.map((spec) => spec.name).join(", ")}
                            </p>
                            <p className="doctor-location text-muted">
                              <i className="fas fa-map-marker-alt"></i> {consultation.doctor.location}
                            </p>
                            <div className="doctor-rating">
                              <i className="fas fa-star text-success"></i> 4.5
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="card mb-4 appointment-card shadow-sm rounded">
                      <div className="card-body">
                        <h4 className="card-title">Appointment Details</h4>
                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>Appointment Type:</strong> {consultation.appointment_type}</p>
                            <p><strong>Clinic Location:</strong> {consultation.doctor.address}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Date & Time:</strong> <i className="fas fa-calendar-alt"></i> {formatDate(consultation.date_slot)}, {consultation.time_slot}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Patient Details */}
                    <div className="card mb-4 patient-card shadow-sm rounded">
                      <div className="card-body">
                        <h4 className="card-title">Patient Details</h4>
                        <p><strong>{consultation.member.name}</strong>, {consultation.member.gender}, {consultation.member.age}</p>
                        {/* <button className="btn btn-outline-primary btn-sm">Edit details</button> */}
                      </div>
                    </div>
                  </div>

                  {/* Price & Booking Details */}
                  <div className="col-lg-4">
                    {/* Price Details */}
                    <div className="card mb-4 price-card shadow-sm rounded">
                      <div className="card-body">
                        <h4 className="card-title">Price Details</h4>
                        <p>Consult Fee: <span>&#8377;228.80</span></p>
                        <p>Platform Fee: <span>&#8377;28.80</span></p>
                        <hr />
                        <h5>Total Pay: <span className="text-success">&#8377;185.00</span></h5>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="card mb-4 booking-card shadow-sm rounded">
                      <div className="card-body">
                        <h4 className="card-title">Booking Details</h4>
                        <p>Booking ID: <strong>{consultation.razorpay_booking_id}</strong></p>
                        <p>Payment: <strong>{consultation.payment_type}</strong></p>
                        <p>Booking Date: <strong>{formatDate(consultation.booking_date)}</strong></p>
                        {/* if status cancelled in that case dont show this */}
                        {consultation.status !== "cancelled" && (
                          <button className="btn btn-danger btn-block" onClick={handleCancelAppointment}>Cancel Appointment</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* End of Consultation Details */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyDocConsultationDetails;
