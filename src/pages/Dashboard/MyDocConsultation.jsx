import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";
import axiosConfig from "../../services/axiosToken";
import { useNavigate } from "react-router-dom";

function MyDocConsultation() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [visibleConsultations, setVisibleConsultations] = useState(5); // Default to show 5 consultations
  const [consultType, setConsultType] = useState("onlineConsult");

  // Function to fetch consultations based on the selected consult type
  const fetchConsultations = async (type) => {
    const endpoint =
      type === "onlineConsult"
        ? "/doctor_online_consult"
        : "/doctor_visit_clinic"; // Change the API based on selection

    try {
      const response = await axiosConfig.get(endpoint);
      // Sort consultations by nearest booking date
      const sortedConsultations = response.data.data.sort(
        (a, b) => new Date(a.booking_date) - new Date(b.booking_date)
      );
      setConsultations(sortedConsultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  useEffect(() => {
    // Fetch consultations initially for the default selected type
    fetchConsultations(consultType);
  }, [consultType]);

  // Handle dropdown change to trigger different API calls
  const handleConsultTypeChange = (event) => {
    setConsultType(event.target.value);
    setVisibleConsultations(5); // Reset visible consultations when switching types
  };

  // Load more consultations by increasing visible count
  const handleLoadMore = () => {
    setVisibleConsultations((prev) => prev + 5); // Show 5 more consultations
  };

  const handleViewDetails = (consultation) => {
    // Handle view details logic here
    navigate("/dashboard/doctor-consults-details", {
      state: { consultation: consultation, type: consultation.appointment_type },
    });
  };

  // Function to assign a status class based on consultation status
  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "badge-success";
      case "pending":
        return "badge-warning";
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
                <a href="#">Doctor Consultation</a>
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
                <div className="personal-info d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="section-title">Doctor Consultation</h3>
                    <span className="section-subtitle">Below are the details</span>
                  </div>
                  <div className="form-group mt-3" style={{ width: "200px" }}>
                    <select
                      className="form-select"
                      value={consultType}
                      onChange={handleConsultTypeChange}
                    >
                      <option value="onlineConsult">Online consult</option>
                      <option value="visitClinic">Visit clinic</option>
                    </select>
                  </div>
                </div>

                {/* Doctor Consultation List */}
                <div className="consultation-list mt-4">
                  {consultations.length > 0 ? (
                    consultations
                      .slice(0, visibleConsultations) // Show only the visible number of consultations
                      .map((consultation, index) => (
                        <div
                          key={index}
                          className="consultation-item p-4 mb-4 shadow-sm rounded bg-white"
                          style={{ border: "1px solid #f1f1f1" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <img
                                src={consultation.doctor.image}
                                alt={consultation.doctor.name}
                                className="rounded-circle me-3"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <p className="mb-1 fw-bold">
                                  Dr. {consultation.doctor.name}
                                </p>
                                <p className="mb-1 text-muted">
                                  {consultation.doctor.specialities
                                    .map((speciality) => speciality.name)
                                    .join(", ")}
                                </p>
                              </div>
                            </div>

                            <div className="d-flex align-items-start flex-column">
                              <p className="mb-1 fw-bold">Patient Details</p>
                              <p className="mb-0">
                                {consultation.member.name}{" "}
                                <span className=" ms-2 text-green">
                                  {consultation.member.gender},{" "}
                                  {consultation.member.age}
                                </span>
                              </p>
                            </div>

                            <div className="d-flex align-items-start flex-column">
                              <p className="mb-1 fw-bold">Date & Time</p>
                              <p className="mb-0">
                                {consultation.date_slot},{" "}
                                {consultation.time_slot}
                              </p>
                            </div>

                            {/* Status above the details button */}
                            <div className="d-flex flex-column align-items-end">
                              <span
                                className={`badge ${getStatusClass(
                                  consultation.status
                                )}`}
                                style={{ marginBottom: "10px" }}
                              >
                                {consultation.status.toUpperCase()}
                              </span>
                              <button
                                className="btn btn-outline-success btn-r"
                                onClick={() => handleViewDetails(consultation)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>No consultations found.</p>
                  )}
                </div>

                {/* Load More Button */}
                {visibleConsultations < consultations.length && (
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-primary buttonCustom"
                      onClick={handleLoadMore}
                    >
                      Load More
                    </button>
                  </div>
                )}
                {/* End of Doctor Consultation List */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyDocConsultation;
