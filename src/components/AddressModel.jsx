import React, { useEffect, useState } from "react";
import axiosConfig from "../services/axiosToken";

function AddressModel({ isOpen, onClose, selectedAddress, setSelectedAddress }) {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    getAddresses();
  }, []);

  const getAddresses = async () => {
    try {
      const response = await axiosConfig.get("/addresses");
      setAddresses(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null; // Render nothing if the modal is not open

  const handleAddressSelect = (address) => {
    localStorage.setItem("selectedAddress", address.id);
    setSelectedAddress(address); // Update the selected address in the parent component
    onClose(); // Close the modal after selecting the address
  };

  return (
    <div
      className="modal top show"
      id="exampleModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-mdb-backdrop="static"
      data-mdb-keyboard="true"
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-dialog-centered mw-5">
        <div className="modal-content">
          <div className="modal-header header24">
            <h5 className="modal-title" id="exampleModalLabel">
              Address List
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body bodycard">
            {addresses && addresses.length > 0 ? (
              <>
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="address-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm bg-white"
                  >
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="selectedAddress"
                        value={address.id}
                        checked={selectedAddress && selectedAddress.id === address.id}
                        className="form-check-input me-3"
                        onChange={() => handleAddressSelect(address)} // Update the selected address
                      />
                      <div>
                        <div className="fw-semibold mb-1">{address.name}</div>
                        <div className="text-muted small">
                          {address.address_line1}, {address.city_state},{" "}
                          {address.pin_code} {address.landmark}{" "}
                          {address.phone_number}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="no-address text-center">
                <p className="mb-3">No addresses available. Please add one.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/add-address")}
                >
                  Add Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressModel;
