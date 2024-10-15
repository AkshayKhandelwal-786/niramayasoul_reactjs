import React, { useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";
import axiosConfig from "../../services/axiosConfig";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState({ success: null, message: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleVisibility = (field) => {
    setPasswordVisible({
      ...passwordVisible,
      [field]: !passwordVisible[field],
    });
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!formData.currentPassword) {
      validationErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      validationErrors.newPassword = "New password is required";
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Structure the data to match API requirements
    const requestData = {
      customer: {
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      },
    };

    try {
      const response = await axiosConfig.post("/customers/change_password", requestData); // API call
      setApiResponse({ success: true, message: "Password updated successfully!" });
    } catch (error) {
      setApiResponse({
        success: false,
        message: error.response?.data?.message || "Failed to update password",
      });
    }
  };

  return (
    <Layout>
      <nav data-mdb-navbar-init className="navbar navbar-expand-lg shadow-none bg-white detail-y">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb gap-3">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li>/</li>
              <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
              <li>/</li>
              <li className="breadcrumb-item"><a href="#">Change Password</a></li>
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
                <div className="personal-info">
                  <h3>Change Password</h3>
                  <span>Below add details to change password</span>
                </div>

                {/* Change password form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <div className="input-group">
                      <input
                        type={passwordVisible.currentPassword ? "text" : "password"}
                        className="form-control"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Enter current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                      <span
                        className="input-group-text"
                        onClick={() => handleToggleVisibility("currentPassword")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={passwordVisible.currentPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                      </span>
                    </div>
                    {errors.currentPassword && <div className="text-danger">{errors.currentPassword}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="input-group">
                      <input
                        type={passwordVisible.newPassword ? "text" : "password"}
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                      <span
                        className="input-group-text"
                        onClick={() => handleToggleVisibility("newPassword")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={passwordVisible.newPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                      </span>
                    </div>
                    {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={passwordVisible.confirmPassword ? "text" : "password"}
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Enter confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <span
                        className="input-group-text"
                        onClick={() => handleToggleVisibility("confirmPassword")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={passwordVisible.confirmPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                      </span>
                    </div>
                    {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                  </div>

                  <button type="submit" className="btn btn-success">Update Password</button>
                </form>

                {/* Display API response */}
                {apiResponse.message && (
                  <div className={apiResponse.success ? "text-success" : "text-danger"}>
                    {apiResponse.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default ChangePassword;
