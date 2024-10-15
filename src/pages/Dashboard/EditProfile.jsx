import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Sidebar from './Sidebar';
import DashboardSubHeader from './DashboardSubHeader';
import axiosConfig from '../../services/axiosToken';

function EditProfile() {
    const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    phone_number: '',
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch current profile data to prefill the form (if needed)
  useEffect(() => {
    const fetchProfileData = async () => {
        setLoading(true);
      try {
        const response = await axiosConfig.get('/customers/profile');
        
        setFormData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);

      }
    };

    fetchProfileData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Valid email is required';
  
    // Updated phone number validation to accept +91 or just 10 digits
    if (!formData.phone_number || !/^(\+91)?[6-9]\d{9}$/.test(formData.phone_number.trim()))
      newErrors.phone_number = 'Phone number must be a valid 10-digit number with optional +91 country code';
  
    if (!formData.age || isNaN(formData.age) || formData.age <= 0)
      newErrors.age = 'Valid age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);

        const response = await axiosConfig.put('/customers/update_profile', {
          customer: formData,
        });
        setSuccessMessage('Profile updated successfully!');
        setLoading(false);

      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
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
                <div className="personal-info mb-4">
                  <h3>Edit Information</h3>
                  <span>Here is your information</span>
                </div>

                {/* Edit profile */}
                <div className="card-list">
                  <form onSubmit={handleSubmit}>
                    {successMessage && (
                      <div className="alert alert-success">{successMessage}</div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="first_name" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.first_name ? 'is-invalid' : ''
                        }`}
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name && (
                        <div className="invalid-feedback">
                          {errors.first_name}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="last_name" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.last_name ? 'is-invalid' : ''
                        }`}
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      {errors.last_name && (
                        <div className="invalid-feedback">
                          {errors.last_name}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? 'is-invalid' : ''
                        }`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone_number" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.phone_number ? 'is-invalid' : ''
                        }`}
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                      />
                      {errors.phone_number && (
                        <div className="invalid-feedback">
                          {errors.phone_number}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="age" className="form-label">
                        Age
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.age ? 'is-invalid' : ''
                        }`}
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                      {errors.age && (
                        <div className="invalid-feedback">{errors.age}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="gender" className="form-label">
                        Gender
                      </label>
                      <select
                        className={`form-control ${
                          errors.gender ? 'is-invalid' : ''
                        }`}
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && (
                        <div className="invalid-feedback">{errors.gender}</div>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary buttonCustom">
                      Save Changes
                    </button>
                  </form>
                </div>
                {/* End of profile */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default EditProfile;
