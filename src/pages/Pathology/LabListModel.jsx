import React, { useEffect, useState } from "react";
import axiosConfig from "../../services/axiosConfig";
import { useNavigate } from "react-router-dom";

function LabListModel({ isOpen, onClose, onLabSelected }) {
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchLabs();
    }
  }, [isOpen]);

  const fetchLabs = async () => {
    try {
      const response = await axiosConfig.get("/labs"); // Adjust API endpoint as needed
      setLabs(response.data.data);
      setFilteredLabs(response.data.data);
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  };

  const handleLabSelection = (labId) => {
    setSelectedLab(labId);
  };

  const handleSubmit = async () => {
    if (!selectedLab) {
      return alert("Please select a lab before submitting.");
    }

    const savedCart = localStorage.getItem("cart");
    if (!savedCart) {
      return alert("No lab tests found in the cart.");
    }

    const labTestIds = JSON.parse(savedCart);
    // Store lab ID in localStorage
    localStorage.setItem("selectedLab", selectedLab);

    const requestData = {
      lab_test_booking: {
        lab_id: selectedLab,
        lab_tests: labTestIds.map((testId) => ({ lab_test_id: testId })),
      },
    };

    try {
      const response = await axiosConfig.post(
        "/lab_test_bookings/validate_lab_tests_availablity",
        requestData
      );

      if (response.data.status.code === 200) {
        //alert(response.data.status.message);

        // Inform parent component of selected lab
        onLabSelected(selectedLab);
        
        onClose(); // Close the modal after successful submission
        navigate("/pathology/lab-test/cart"); // Navigate to the desired page
      } else {
        alert("Error: " + response.data.status.message);
      }
    } catch (error) {
      alert("Some Lab tests do not belong to the selected lab");
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredLabs(
      labs.filter((lab) =>
        lab.name.toLowerCase().includes(searchValue)
      )
    );
  };

  if (!isOpen) return null; // Render nothing if the modal is not open

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
          <div className="modal-header">
            <h5 className="modal-title">Lab List</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Lab Search Box */}
            <div className="search-bar mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search for labs..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <form>
              {filteredLabs.length > 0 ? (
                filteredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className={`lab-item mb-3 p-3 border rounded shadow-sm form-check ${
                      selectedLab === lab.id ? "selected-lab" : ""
                    }`}
                  >
                    <label
                      className="d-flex align-items-center form-check-label"
                      htmlFor={`lab-${lab.id}`}
                      onClick={() => handleLabSelection(lab.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        id={`lab-${lab.id}`}
                        name="lab"
                        value={lab.id}
                        onChange={() => handleLabSelection(lab.id)}
                        checked={selectedLab === lab.id}
                        className="form-check-input me-3"
                      />
                      <img
                        src={lab.image_url}
                        alt={lab.name}
                        className="lab-image me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 className="fw-bold mb-1">{lab.name}</h6>
                        {lab.addresses.length > 0 ? (
                          <p className="mb-1 text-muted">
                            {lab.addresses[0].city_state}
                          </p>
                        ) : (
                          <p className="mb-1 text-muted">
                            No address available
                          </p>
                        )}
                        {/* Report Time */}
                        <p className="small text-info">
                          Report time:{" "}
                          {lab.report_time
                            ? lab.report_time
                            : "Not available"}
                        </p>
                      </div>
                    </label>
                  </div>
                ))
              ) : (
                <p>No labs available</p>
              )}

              <button
                type="button"
                className="buttonCustom mt-3 w-100"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabListModel;
