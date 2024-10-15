import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosConfig from "../../services/axiosConfig";

function PathologySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("");
  const [healthConcerns, setHealthConcerns] = useState([]);
  const [selectedHealthConcern, setSelectedHealthConcern] = useState(null);

  useEffect(() => {
    // Fetch health concerns only if they are not already loaded
    if (healthConcerns.length === 0) {
      fetchHealthConcerns();
    }

    const path = location.pathname.split('/').filter(Boolean);
    const [option, page, concernSlug, concernId] = path;

    if (page === "lab-test" || page === "packages") {
      setSelectedOption(page);
    } else {
      setSelectedOption("");
    }

    if (concernSlug && concernId) {
      const concern = healthConcerns.find(c =>
        generateSlug(c.name) === concernSlug && c.id.toString() === concernId
      );
      setSelectedHealthConcern(concern?.id || null);
    } else {
      setSelectedHealthConcern(null);
    }
  }, [location.pathname, healthConcerns]);

  const fetchHealthConcerns = async () => {
    try {
      const { data } = await axiosConfig.get("/health_concerns");
      setHealthConcerns(data.data);
    } catch (error) {
      console.error("Error fetching health concerns:", error);
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    navigate(`/pathology/${value}`);
  };

  const handleHealthConcernChange = (name, id) => {
    const slug = generateSlug(name);
    const baseUrl = selectedOption === "lab-test" ? "lab-test" : "packages";
    navigate(`/pathology/${baseUrl}/${slug}/${id}`);
  };

  const generateSlug = (name) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <div className="col-lg-3">
      <div className="card-filter">
        <div className="filter-heading d-flex justify-content-between align-items-center">
          <h3 className="filter-title">Filters</h3>

        </div>
        <div className="border-bottom mb-4"></div>

        <div className="list-filter">
          <span>Types of Test</span>
          <ul className="list-group list-group-light list-checkbox">
            <li className="list-group-item">
              <input
                className="form-check-input me-1"
                type="radio"
                id="lab-test"
                name="test-type"
                value="lab-test"
                checked={selectedOption === "lab-test"}
                onChange={handleOptionChange}
                aria-label="Lab Test"
              />
              <label htmlFor="lab-test">Lab Test</label>
            </li>

            <li className="list-group-item">
              <input
                className="form-check-input me-1"
                type="radio"
                id="Packages"
                name="test-type"
                value="packages"
                checked={selectedOption === "packages"}
                onChange={handleOptionChange}
                aria-label="Packages"
              />
              <label className="active-label" htmlFor="Packages">
                Packages
              </label>
            </li>
          </ul>
          <div className="border-bottom mb-4"></div>

          <div className="list-filter">
            <span>Health Concerns</span>
            <ul className="list-group list-group-light list-checkbox">
              {healthConcerns.map((concern) => (
                <li className="list-group-item" key={concern.id}>
                  <input
                    className="form-check-input me-1"
                    type="radio"
                    id={`concern-${concern.id}`}
                    name="concern"
                    checked={selectedHealthConcern === concern.id}
                    value={concern.name}
                    onChange={() => handleHealthConcernChange(concern.name, concern.id)}
                    aria-label={concern.name}
                  />
                  <label htmlFor={`concern-${concern.id}`}>{concern.name}</label>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default PathologySidebar;
