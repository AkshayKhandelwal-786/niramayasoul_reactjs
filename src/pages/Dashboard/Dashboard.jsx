import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import axiosConfig from "../../services/axiosToken";
import DashboardSubHeader from "./DashboardSubHeader";

function Dashboard() {
  const [loading, setLoading] = useState(true); // Loading state
  const [profileData, setProfileData] = useState({}); // State to store profile data
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch profile data from the API
    const fetchProfileData = async () => {
      try {
        const response = await axiosConfig.get("/customers/profile");
        setProfileData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (error) {
    return <div>{error}</div>; // Show an error message if fetching fails
  }

  return (
    <Layout>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
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
                <a href="#">Profile</a>
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
                    <h3>Personal Information</h3>
                    <span>Here is your information</span>
                  </div>
                  {/* Edit Profile button */}
                  <Link
                    to="/dashboard/edit-profile"
                    className="btn btn-outline-primary"
                  >
                    Edit Profile
                  </Link>
                </div>

                <div className="d-flex justify-content-between align-items-center card-infos">
                  <div className="edit-info">
                    <label className="d-block">Name</label>
                    <span>
                      {profileData.first_name || "N/A"}{" "}
                      {profileData.last_name || ""}
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center card-infos">
                  <div className="edit-info">
                    <label className="d-block">Phone Number</label>
                    <span>{profileData.phone_number || "N/A"}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center card-infos">
                  <div className="edit-info">
                    <label className="d-block">Email</label>
                    <span>{profileData.email || "N/A"}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center card-infos">
                  <div className="edit-info">
                    <label className="d-block">Age</label>
                    <span>{profileData.age || "N/A"}</span>
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

export default Dashboard;
