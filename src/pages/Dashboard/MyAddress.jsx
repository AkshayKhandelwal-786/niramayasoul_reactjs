import React, { useState, useEffect } from 'react';
import axiosConfig from "../../services/axiosToken";
import Layout from '../../components/Layout';
import Sidebar from './Sidebar';
import DashboardSubHeader from './DashboardSubHeader';

function MyAddress() {
  const [addresses, setAddresses] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer visibility
  const [formData, setFormData] = useState({
    name: '',
    pin_code: '',
    city_state: '',
    address_line1: '',
    landmark: '',
    member_first_name: '',
    member_last_name: '',
    phone_number: ''
  });
  const [isEditMode, setIsEditMode] = useState(false); // State to check if it's edit mode
  const [currentAddressId, setCurrentAddressId] = useState(null); // Store the current address id being edited
  const [errors, setErrors] = useState({}); // State to track validation errors

  // Function to fetch addresses from the API
  const fetchAddresses = async () => {
    try {
      const response = await axiosConfig.get('/addresses');
      setAddresses(response.data.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Function to handle form submission for both add and edit modes
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (validateForm()) {
      try {
        if (isEditMode) {
          // Edit address API call
          await axiosConfig.put(`/addresses/${currentAddressId}`, { address: formData });
          console.log('Address updated successfully');

        } else {
          // Add new address API call
          await axiosConfig.post('/addresses', { address: formData });
          console.log('Address created successfully');
        }

        // Close drawer and refetch addresses
        setIsDrawerOpen(false);
        fetchAddresses();

        // Reset form data
        setFormData({
          name: '',
          pin_code: '',
          city_state: '',
          address_line1: '',
          landmark: '',
          member_first_name: '',
          member_last_name: '',
          phone_number: ''
        });
        setIsEditMode(false); // Reset the edit mode
        setCurrentAddressId(null); // Clear current address id

      } catch (error) {
        console.error('Error submitting address:', error);
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.pin_code || formData.pin_code.length !== 6) newErrors.pin_code = 'Pin code must be 6 digits';
    if (!formData.city_state) newErrors.city_state = 'City and state are required';
    if (!formData.address_line1) newErrors.address_line1 = 'Address line is required';
    if (!formData.landmark) newErrors.landmark = 'Landmark is required';
    if (!formData.member_first_name) newErrors.member_first_name = 'First name is required';
    if (!formData.member_last_name) newErrors.member_last_name = 'Last name is required';
    if (!formData.phone_number || formData.phone_number.length !== 10) newErrors.phone_number = 'Phone number must be 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form data as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle editing an address (pre-fill form data and open drawer)
  const handleEditAddress = (address) => {
    setIsEditMode(true);
    setCurrentAddressId(address.id); // Store the address id being edited
    setFormData({
      name: address.name,
      pin_code: address.pin_code,
      city_state: address.city_state,
      address_line1: address.address_line1,
      landmark: address.landmark,
      member_first_name: address.member_first_name,
      member_last_name: address.member_last_name,
      phone_number: address.phone_number,
    });
    setIsDrawerOpen(true); // Open the drawer in edit mode
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Set an address as default
  const setDefaultAddress = async (id) => {
    try {
      await axiosConfig.post(`/addresses/${id}/set_default_address`);
      fetchAddresses(); // Refetch the addresses after setting the default
    } catch (error) {
      console.error('Error setting default address:', error);
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
                <a href="#">Delivery Address</a>
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
                  <h3>Delivery Address</h3>
                  <span>Below Are The Address List</span>
                </div>

                {/* Delivery list */}
                <div className="card-list">
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <div className="card mb-3" key={address.id}>
                        <div className="row g-0 align-items-center">
                          <div className="col-md-8">
                            <div className="card-body">
                              <h5 className="card-title">{address.name}</h5>
                              <p className="card-text">
                                {address.address_line1}, {address.city_state}, {address.pin_code} <br />
                                <strong>Phone:</strong> {address.phone_number}
                              </p>
                              <p className="card-text">
                                <strong>Landmark:</strong> {address.landmark}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 d-flex align-items-center justify-content-end">
                            <div className="d-flex gap-2">
                              {address.default_address ? (
                                <button className="btn btn-success" disabled>
                                  Default Address
                                </button>
                              ) : (
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => setDefaultAddress(address.id)}
                                >
                                  Set as default
                                </button>
                              )}
                              <button
                                className="btn btn-link text-success"
                                onClick={() => handleEditAddress(address)} // Call edit handler
                              >
                                Edit Address
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No addresses found.</p>
                  )}
                </div>

                {/* Add new address button */}
                <div className="text-center mt-4">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setIsEditMode(false); // Make sure it's not in edit mode when adding new
                      setFormData({ // Clear form data
                        name: '',
                        pin_code: '',
                        city_state: '',
                        address_line1: '',
                        landmark: '',
                        member_first_name: '',
                        member_last_name: '',
                        phone_number: ''
                      });
                      setIsDrawerOpen(true); // Open drawer for new address
                    }}
                  >
                    Add New Address
                  </button>
                </div>
                {/* End of Delivery list */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide-out drawer for adding or editing an address */}
      <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-content">
          <h4>{isEditMode ? 'Edit Address' : 'Add New Address'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="pin_code" className="form-label">Pin Code</label>
              <input
                type="text"
                className={`form-control ${errors.pin_code ? 'is-invalid' : ''}`}
                id="pin_code"
                name="pin_code"
                value={formData.pin_code}
                onChange={handleChange}
              />
              {errors.pin_code && <div className="invalid-feedback">{errors.pin_code}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="city_state" className="form-label">City & State</label>
              <input
                type="text"
                className={`form-control ${errors.city_state ? 'is-invalid' : ''}`}
                id="city_state"
                name="city_state"
                value={formData.city_state}
                onChange={handleChange}
              />
              {errors.city_state && <div className="invalid-feedback">{errors.city_state}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="address_line1" className="form-label">Address Line</label>
              <input
                type="text"
                className={`form-control ${errors.address_line1 ? 'is-invalid' : ''}`}
                id="address_line1"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
              />
              {errors.address_line1 && <div className="invalid-feedback">{errors.address_line1}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="landmark" className="form-label">Landmark</label>
              <input
                type="text"
                className={`form-control ${errors.landmark ? 'is-invalid' : ''}`}
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
              />
              {errors.landmark && <div className="invalid-feedback">{errors.landmark}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="member_first_name" className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${errors.member_first_name ? 'is-invalid' : ''}`}
                id="member_first_name"
                name="member_first_name"
                value={formData.member_first_name}
                onChange={handleChange}
              />
              {errors.member_first_name && <div className="invalid-feedback">{errors.member_first_name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="member_last_name" className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${errors.member_last_name ? 'is-invalid' : ''}`}
                id="member_last_name"
                name="member_last_name"
                value={formData.member_last_name}
                onChange={handleChange}
              />
              {errors.member_last_name && <div className="invalid-feedback">{errors.member_last_name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="phone_number" className="form-label">Phone Number</label>
              <input
                type="text"
                className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
            </div>

            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-outline-secondary  me-2" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary buttonCustom">{isEditMode ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>

      {/* Overlay to close the drawer */}
      {isDrawerOpen && <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}></div>}
    </Layout>
  );
}

export default MyAddress;
