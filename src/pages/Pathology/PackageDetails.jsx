import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosConfig";
import axiosToken from "../../services/axiosToken";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { Modal, Button } from "react-bootstrap"; // If using Bootstrap, import these

const generateNextThreeMonthsDates = () => {
  const today = dayjs();
  const dates = [];

  for (let i = 0; i < 10; i++) {
    const date = today.add(i, "day");
    dates.push({
      day: date.format("DD MMM"),
      weekday: date.format("ddd"),
      fullDate: date.format("YYYY-MM-DD"),
    });
  }

  return dates;
};

const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};
function PackageDetails() {
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate(); // For navigation
  const location = useLocation();

  const { packagename } = useParams();
  const { packageId: statePackageId } = location.state || {};
  const packageId = statePackageId || localStorage.getItem("packageId");

  const [labLists, setLabLists] = useState([]); // For labTests
  const [packageDetails, setPackageDetails] = useState({});
  const [labID, setLabID] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // Add state for selected time slot
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const [members, setMembers] = useState([]); // State to hold members data
  const [selectedMember, setSelectedMember] = useState(null); // State to hold selected member
  const [appointmentType, setAppointmentType] = useState(""); // Set this based on button clicked

  const [popularPackages, setPopularPackages] = useState([]);

  const [selectedLab, setSelectedLab] = useState(null); // For single lab details

  useEffect(() => {
    getLabLists(); // Call API when component mounts or currentPage changes
    getPackageDetails(); // Call API when componentz̄
    getLabTimeSlots();
    getPopularPackages();
    fetchMembers(); // Fetch members when the modal is shown
  }, [selectedDate, selectedTab]);

  const getPackageDetails = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await axiosConfig.get(`/packages/${packageId}`);
      setPackageDetails(response.data.data); // Set the labTests state
      setLabID(response.data.data.lab_id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const getLabLists = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await axiosConfig.get(`/labs`);
      setLabLists(response.data.data); // Set the labTests state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const getLabTimeSlots = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await axiosToken.get(
        `/labs/${labID}/time_slots?date=${selectedDate}`
      );
      setTimeSlots(response.data.data.available_slots); // Set the labTests state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };
  const fetchMembers = async () => {
    try {
      const response = await axiosToken.get("/members");

      if (response.data.status.code === 200) {
        setMembers(response.data.data); // Update members state with API data
      } else {
        console.error("Error fetching members:", response.data.status.message);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  //   popular packages
  const getPopularPackages = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await axiosConfig.get(`/packages/popular_packages`);
      setPopularPackages(response.data.data); // Set the labTests state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const dates = generateNextThreeMonthsDates();
  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleShowModal = (type) => {
    setShowModal(true);
    setAppointmentType(type);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmSelection = async () => {
    if (!selectedMember) {
      alert("Please select a member.");
      return;
    }
    localStorage.setItem("selectedMember", selectedMember);
    localStorage.setItem("labid", labID);
    localStorage.setItem("package_id", packageId);
    localStorage.setItem("bookingDate", selectedDate);
    localStorage.setItem("bookingSlot", selectedTimeSlot);
    localStorage.setItem("appointmentType", appointmentType);
    handleCloseModal(); // Close the modal after successful booking
    navigate(`/pathology/packages/book/${toSlug(packagename)}`, {
      state: { packageId: packageId },
    });
  };

  useEffect(() => {
    // Find the lab with the matching labID
    if (labLists.length > 0 && labID) {
      const lab = labLists.find((lab) => lab.id == labID); // Adjust 'id' as per your actual key
      setSelectedLab(lab);
    }
  }, [labLists, labID]); // Depend on labLists and labID

  const [newMember, setNewMember] = useState({
    name: "",
    age: "",
    gender: "",
    dob: "",
    phone_number: "",
  });
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  // Function to toggle the add member form

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (
      !newMember.name ||
      !newMember.age ||
      !newMember.dob ||
      !newMember.gender ||
      !newMember.phone_number
    ) {
      alert("All fields are required.");
      return;
    }

    if (newMember.phone_number.length !== 10) {
      alert("Phone number must be 10 digits.");
      return;
    }

    try {
      const response = await axiosToken.post("/members", {
        member: {
          name: newMember.name,
          age: newMember.age,
          dob: dayjs(newMember.dob).format("DD-MM-YYYY"),
          gender: newMember.gender,
          phone_number: newMember.phone_number,
        },
      });

      if (response.data.status.code === 201) {
        // Successfully added member, go back to the list
        setMembers([...members, response.data.data]);
        setShowAddMemberForm(false); // Hide the form after adding
        setNewMember({
          name: "",
          age: "",
          dob: "",
          gender: "",
          phone_number: "",
        });
        alert("Member added successfully!");
      } else {
        alert("Failed to add member.");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle member selection
  const handleMemberSelection = (id) => {
    setSelectedMember(id);
  };

  // Toggle the form
  const toggleAddMemberForm = () => {
    setShowAddMemberForm(!showAddMemberForm);
  };

  const handleLogingRedirect = (redirectURL) => {
    localStorage.setItem("redirectURL", redirectURL);
    localStorage.setItem("packageId", packageId);
    navigate("/login");
  };
  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    ); // Show loader overlay
  }

  //   console.log(selectedLab.addresses[].name);
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
                <a href="#">Pathology</a>
              </li>
              <li>/</li>
              <li className="breadcrumb-item">
                <a href="#">Packages</a>
              </li>
              <li>/</li>
              <li
                className="breadcrumb-item active-bradcurmb"
                aria-current="page"
              >
                <a href="#">{packageDetails.name}</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blood-sugar d-lg-flex align-items-center justify-content-between">
                <div className="d-lg-flex align-items-center">
                  <div className="image-blood-sugar">
                    <img
                      src={"/img/checkup.png" || packageDetails.image_url}
                      alt={packageDetails.name}
                      className="img-fluid"
                    />
                  </div>
                  <div className="blood-details">
                    <h3>{packageDetails.name}</h3>
                    <p>
                      <span>Type:</span> {packageDetails.requirement}
                    </p>
                    <div>
                      <p>Reports in 24 hrs</p>
                    </div>
                  </div>
                </div>
                <div className="center-blood">
                  <p>
                    Best price : <span>₹{packageDetails.selling_price}</span>
                  </p>
                  {/* <p>
                    Best price : <span>₹120</span>
                  </p> */}
                </div>
              </div>

              <div className="list-page">
                <h3>Test requirements</h3>
                <ul className="ps-4">
                  <li>{packageDetails.requirement}</li>
                </ul>
              </div>

              <div className="list-page">
                <h3>Test Includes</h3>
                <ul className="ps-4">
                  {/* Check if included tests are available and map over them */}
                  {packageDetails.included_test &&
                  packageDetails.included_test.length > 0 ? (
                    packageDetails.included_test.map((test, index) => (
                      <li key={index}>{test}</li>
                    ))
                  ) : (
                    <li>No tests included in this package.</li>
                  )}
                </ul>

                {/* Display other package details if needed */}
              </div>
              <div className="list-page">
                {packageDetails.lab && (
                  <div className="lab-info">
                    <h5>Lab Information</h5>
                    <p>Lab Name: {packageDetails.lab.name}</p>
                  </div>
                )}
              </div>

              {/* <div className="discreption-blood mb156">
                <span>
                  <img src="/img/disc.svg" alt="" />
                  Description
                </span>
                <p>
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                  Morbi ut nisi odio. Nulla facilisi. Nunc risus massa, gravida
                  id egestas a, pretium vel tellus. Praesent feugiat diam sit
                  amet pulvinar finibus. Etiam et nisi aliquet, accumsan nisi
                  sit.
                </p>
                <div className="border-bottom"></div>
              </div>
              <div className="discreption-blood mb194">
                <span>
                  <img src="/img/percent.svg" alt="" />
                  Offer for you
                </span>
                <div className="offer-cards d-flex justify-content-between align-items-center">
                  <div className="offer-icon d-flex align-items-center">
                    <img src="/img/offer-icon.svg" alt="" />
                    <div className="offer-content">
                      <h3>Extra20</h3>
                      <p>Flat Rs.20 off on all your test and packages</p>
                    </div>
                  </div>
                  <a className="align-self-start" href="#">
                    <img src="/img/copy.svg" alt="" />
                  </a>
                </div>
                <div className="offer-cards d-flex justify-content-between align-items-center">
                  <div className="offer-icon d-flex align-items-center">
                    <img src="/img/offer-icon.svg" alt="" />
                    <div className="offer-content">
                      <h3>Extra20</h3>
                      <p>Flat Rs.20 off on all your test and packages</p>
                    </div>
                  </div>
                  <a className="align-self-start" href="#">
                    <img src="/img/copy.svg" alt="" />
                  </a>
                </div>
                <div className="offer-cards d-flex justify-content-between align-items-center">
                  <div className="offer-icon d-flex align-items-center">
                    <img src="/img/offer-icon.svg" alt="" />
                    <div className="offer-content">
                      <h3>Extra20</h3>
                      <p>Flat Rs.20 off on all your test and packages</p>
                    </div>
                  </div>
                  <a className="align-self-start" href="#">
                    <img src="/img/copy.svg" alt="" />
                  </a>
                </div>
              </div>
              <div className="discreption-blood blood-list">
                <span>
                  <img src="/img/setting.svg" alt="" />
                  How It Works?
                </span>

                <ul className="ps-4">
                  <li>Govt approved diagnostics centers</li>
                  <li>Regular disinfection of labs </li>
                  <li>Daily temperature check of all technicians</li>
                </ul>
              </div>
              <div className="accordin-details mb60">
                <h4 className="faq">FAQ’s</h4>
                <div className="according">
                  <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          data-mdb-collapse-init
                          className="accordion-button collapsed justify-content-between"
                          type="button"
                          data-mdb-toggle="collapse"
                          data-mdb-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          How can I track my health using your tools?{" "}
                          <img id="plus" src="/img/plus.svg" alt="" />{" "}
                          <img id="minus" src="/img/minus.svg" alt="" />
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-mdb-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <p>
                            Our website offers various tools such as symptom
                            checkers, calorie counters, and fitness trackers.
                            You can access these tools under the "Health Tools"
                            section of our website.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          data-mdb-collapse-init
                          className="accordion-button collapsed justify-content-between"
                          type="button"
                          data-mdb-toggle="collapse"
                          data-mdb-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          How soon will I get the report?{" "}
                          <img id="plus" src="/img/plus.svg" alt="" />{" "}
                          <img id="minus" src="/img/minus.svg" alt="" />
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingTwo"
                        data-mdb-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <p>
                            You can book a consultation online through our
                            website or mobile app. Simply select your preferred
                            doctor, choose a suitable date and time, and
                            complete the booking process.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          data-mdb-collapse-init
                          className="accordion-button collapsed justify-content-between"
                          type="button"
                          data-mdb-toggle="collapse"
                          data-mdb-target="#collapseThree"
                          aria-expanded="true"
                          aria-controls="collapseThree"
                        >
                          Do I need to fast before I take a text?
                          <img id="plus" src="/img/plus.svg" alt="" />
                          <img id="minus" src="/img/minus.svg" alt="" />
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-mdb-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <p>
                            Our website offers various tools such as symptom
                            checkers, calorie counters, and fitness trackers.
                            You can access these tools under the "Health Tools"
                            section of our website.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            {/* here need to show lab sselection list */}

            <div className="col-lg-4">
              <div className="book-consultation">
                <h2 className="m-0 bookbtn">Book Lab Test Package</h2>
                <div className="border-bottom mb13"></div>
                <div className="d-xl-flex gap-3 mb-15">
                  <button
                    className={`fixwidth mb-xl-0 mb-2 buttonCustom ${
                      selectedTab === "home" ? "" : "btn-clinic"
                    }`}
                    href="#"
                    onClick={() => setSelectedTab("home")}
                  >
                    Home Sample
                  </button>
                  <button
                    className={`cart-btn fixwidth mb-0 buttonCustom ${
                      selectedTab === "lab" ? "" : "btn-clinic"
                    }`}
                    href="#"
                    onClick={() => setSelectedTab("lab")}
                  >
                    Visit Lab
                  </button>

                  {/* check selected tab and show lab address if tab is lab */}
                </div>
                {selectedTab === "lab" &&
                  selectedLab?.addresses?.length > 0 && (
                    <span className="mb-2 d-block">
                      {selectedLab.addresses[0].name}{" "}
                      {selectedLab.addresses[0].address_line1}{" "}
                      {selectedLab.addresses[0].pin_code}{" "}
                      {selectedLab.addresses[0].city_state}{" "}
                    </span>
                  )}

                <div className="border-bottom mb13"></div>
                <div className="dateday d-flex justify-content-between gap-lg-2 gap-3 flex-wrap">
                  {dates.map((date, index) => (
                    <div
                      key={index}
                      className={`date ${
                        selectedDate === date.fullDate ? "activedate" : ""
                      }`}
                      onClick={() => setSelectedDate(date.fullDate)}
                    >
                      <span>
                        {date.day === dayjs().format("DD MMM")
                          ? "Today"
                          : date.day}
                      </span>
                      <p className="m-0">{date.weekday}</p>
                    </div>
                  ))}
                </div>
              </div>
              {localStorage.getItem("userid") ? ( // First, check if the user is logged in
                <div className="timeslots">
                  <h2 className="m-0 bookbtn">
                    {timeSlots.length} Time slots available
                  </h2>
                  {timeSlots.length > 0 ? (
                    <>
                      <div className="d-flex justify-content-between flex-wrap gaps">
                        {timeSlots.map((time, index) => (
                          <div
                            className={`time ${
                              selectedTimeSlot === time ? "divCustom" : ""
                            }`}
                            key={index}
                            onClick={() => handleTimeSlotClick(time)}
                          >
                            <span>{time}</span>
                          </div>
                        ))}
                      </div>

                      <div className="d-xl-flex gap-3">
                        <button
                          className={`buttonCustom cart-btn ${
                            selectedTab === "home" ? "" : "btn-clinic"
                          } fixwidth mb-0`}
                          onClick={() => handleShowModal("Home Sample")}
                          disabled={!selectedTimeSlot} // Disable button if no time slot is selected
                        >
                          Home Sample
                        </button>
                        <button
                          className={`buttonCustom cart-btn ${
                            selectedTab === "lab" ? "" : "btn-clinic"
                          } fixwidth mb-0`}
                          onClick={() => handleShowModal("Visit Lab")}
                          disabled={!selectedTimeSlot} // Disable button if no time slot is selected
                        >
                          Visit Lab
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="no-timeslot">No timeslots available</div>
                  )}
                </div>
              ) : (
                // If the user is not logged in, show login prompt
                <button
                  className="buttonCustom cart-btn  mb-0 align-center w-100"
                  onClick={() =>
                    handleLogingRedirect(location.pathname.substring(1))
                  }
                >
                  Login to Book This Package
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Modal Component */}
      {/* Modal Component */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {showAddMemberForm ? "Add Member" : "Select Member"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Show form if showAddMemberForm is true, otherwise show the list */}
          {showAddMemberForm ? (
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={newMember.age}
                  onChange={(e) =>
                    setNewMember({ ...newMember, age: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  className="form-control"
                  value={newMember.gender}
                  onChange={(e) =>
                    setNewMember({ ...newMember, gender: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={newMember.dob}
                  onChange={(e) =>
                    setNewMember({ ...newMember, dob: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={newMember.phone_number}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="d-flex justify-content-between mt-3">
                <Button variant="outline-success" onClick={toggleAddMemberForm}>
                  Cancel
                </Button>
                <Button variant="success" type="submit">
                  Add Member
                </Button>
              </div>
            </form>
          ) : (
            <>
              {members.length > 0 ? (
                <>
                  <form>
                    {members.map((member) => (
                      <div key={member.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="member"
                          id={`member-${member.id}`}
                          value={member.id}
                          onChange={() => handleMemberSelection(member.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`member-${member.id}`}
                        >
                          {member.name} ({member.age} years, {member.gender})
                          <br />
                          <small>DOB: {member.dob}</small>
                          <br />
                          <small>Mobile: {member.phone_number}</small>
                        </label>
                      </div>
                    ))}
                  </form>
                  <div className="mt-3">
                    <Button
                      variant="outline-success"
                      onClick={toggleAddMemberForm}
                      className="w-100"
                    >
                      Add New Member
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <p>No members found.</p>
                  <Button
                    variant="outline-success"
                    onClick={toggleAddMemberForm}
                    className="w-100"
                  >
                    Add New Member
                  </Button>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!showAddMemberForm && (
            <>
              <Button variant="outline-success" onClick={handleCloseModal}>
                Close
              </Button>
              <Button
                variant="success"
                disabled={!selectedMember}
                onClick={handleConfirmSelection}
              >
                Confirm Selection
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default PackageDetails;
