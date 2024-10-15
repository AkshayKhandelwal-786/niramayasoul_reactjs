import React, { useEffect, useState } from "react";
import axiosConfig from "../../services/axiosToken";

function AddressForm({ action, onClose }) {
  const [actions, setActions] = useState(action);
  const [formData, setFormData] = useState({
    name: "",
    pin_code: "",
    city_state: "",
    address_line1: "",
    landmark: "",
    member_first_name: "",
    member_last_name: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});
  const [pincodeError, setPincodeError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (actions) {
      sidebar.classList.add("open");
      overlay.classList.add("visible");
    } else {
      sidebar.classList.remove("open");
      overlay.classList.remove("visible");
    }
  }, [actions]);

  useEffect(() => {
    setErrors(validateForm());
  }, [formData]);

  const handleClose = () => {
    setActions(false);
    onClose(); // Update the parent component's state
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.pin_code) newErrors.pin_code = "Pin Code is required";
    if (!formData.city_state) newErrors.city_state = "City/State is required";
    if (!formData.address_line1)
      newErrors.address_line1 = "Address Line 1 is required";
    if (!formData.landmark) newErrors.landmark = "Landmark is required";
    if (!formData.member_first_name)
      newErrors.member_first_name = "First Name is required";
    if (!formData.member_last_name)
      newErrors.member_last_name = "Last Name is required";
    if (!formData.phone_number)
      newErrors.phone_number = "Phone Number is required";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check pincode availability
    try {
        const response = await axiosConfig.get(`/pincodes/check_pincode_availability`, {
            params: {
              pincode: {
                code: formData.pin_code,
              },
            },
          });
      if (response.data.status.code === 200) {
        setPincodeError(""); // Clear error if pincode is serviceable
      } else {
        setPincodeError("This pincode is not serviceable.");
        return;
      }
    } catch (error) {
      console.error("Error checking pincode availability:", error);
      setPincodeError("This pincode is not serviceable.");
      return;
    }

    // If there are no errors, submit the form
    try {
      setLoading(true);
      const response = await axiosConfig.post("/addresses", formData);
      if (response.status === 201) {
        alert("Address saved successfully!");
        onClose(); // Close the form on success
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="overlay"></div>
      <div id="sidebar">
        <div className="d-flex justify-content-between align-items-center mb-border">
          <span>Add Address</span>
          <button id="closeBtn" onClick={handleClose}>
            <img src="/img/close-btn.svg" alt="Close" />
          </button>
        </div>
        <div className="border-bottom mb18"></div>
        <form onSubmit={handleSubmit}>
          <div className="row g-1 labelfont">
            <div className="col-12 mb-89">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label">Name</label>
                </div>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
            </div>

            <div className="col-12 mb-89">
              <div>
                <label className="form-label">Pin Code</label>
                <input
                  type="text"
                  name="pin_code"
                  className="form-control"
                  placeholder="Enter pin code"
                  value={formData.pin_code}
                  onChange={handleInputChange}
                  maxLength={6} // Limit input to 6 characters
                />
                {errors.pin_code && <div className="error">{errors.pin_code}</div>}
                {pincodeError && <div className="error">{pincodeError}</div>}
              </div>
            </div>

            <div className="col-12 mb-89">
              <div>
                <label className="form-label">City /State</label>
                <input
                  type="text"
                  name="city_state"
                  className="form-control"
                  placeholder="Enter city state"
                  value={formData.city_state}
                  onChange={handleInputChange}
                />
                {errors.city_state && <div className="error">{errors.city_state}</div>}
              </div>
            </div>

            <div className="col-12 mb-89">
              <div>
                <label className="form-label">Address Line 1</label>
                <input
                  type="text"
                  name="address_line1"
                  className="form-control"
                  placeholder="Enter address line 1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                />
                {errors.address_line1 && <div className="error">{errors.address_line1}</div>}
              </div>
            </div>

            <div className="col-12 mb-89">
              <div>
                <label className="form-label">Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  className="form-control"
                  placeholder="Enter landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
                {errors.landmark && <div className="error">{errors.landmark}</div>}
              </div>
            </div>

            <div className="col-12 mb-89">
              <div>
                <label className="form-label">Member First Name</label>
                <input
                  type="text"
                  name="member_first_name"
                  className="form-control"
                  placeholder="Enter first name"
                  value={formData.member_first_name}
                  onChange={handleInputChange}
                />
                {errors.member_first_name && <div className="error">{errors.member_first_name}</div>}
              </div>
            </div>

            <div className="col-12 mb-89">
              <div>
                <label className="form-label">Member Last Name</label>
                <input
                  type="text"
                  name="member_last_name"
                  className="form-control"
                  placeholder="Enter last name"
                  value={formData.member_last_name}
                  onChange={handleInputChange}
                />
                {errors.member_last_name && <div className="error">{errors.member_last_name}</div>}
              </div>
            </div>

            <div className="col-12 mb-89">
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone_number"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
                {errors.phone_number && <div className="error">{errors.phone_number}</div>}
              </div>
            </div>

            <button type="submit" className="buttonCustom" disabled={loading}>
              {loading ? 'Saving Address...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddressForm;
