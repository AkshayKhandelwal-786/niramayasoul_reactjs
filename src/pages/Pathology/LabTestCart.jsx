import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfigWeb from "../../services/axiosConfig";
import axiosConfig from "../../services/axiosToken";
import dayjs from "dayjs";
import AddressModel from "../../components/AddressModel";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // If using Bootstrap, import these
import LabListModel from "./LabListModel";

const generateNextThreeMonthsDates = () => {
  const today = dayjs();
  return Array.from({ length: 10 }, (_, i) => {
    const date = today.add(i, "day");
    return {
      day: date.format("DD MMM"),
      weekday: date.format("ddd"),
      fullDate: date.format("YYYY-MM-DD"),
    };
  });
};

function LabTestReview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [labID, setLabID] = useState(localStorage.getItem("selectedLab") || "");
  const [labLists, setLabLists] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [cart, setCart] = useState([]);
  const [members, setMembers] = useState([]); // State to hold members data
  const [selectedMember, setSelectedMember] = useState(null); // State to hold selected member
  const [appointmentType, setAppointmentType] = useState(""); // Set this based on button clicked

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Check if user is logged in

  // check cart and cartData, if empty or null, redirect to pathology page
  useEffect(() => {
    const storedCartData = localStorage.getItem("cartData");
    const storedCart = localStorage.getItem("cart");
  
    if (
      !storedCartData ||
      JSON.parse(storedCartData).length === 0 ||
      !storedCart ||
      JSON.parse(storedCart).length === 0
    ) {
      navigate("/pathology/lab-test");
    } else {
      setCartData(JSON.parse(storedCartData));
      setCart(JSON.parse(storedCart));
    }
  }, [navigate]);
  
  // Fetch labs data (works without login)
  const fetchLabsData = async () => {
    setLoading(true);
    try {
      const labsResponse = await axiosConfigWeb.get(`/labs`);
      setLabLists(labsResponse.data.data);
    } catch (error) {
      console.error("Error fetching labs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch time slots (requires login)
  const fetchTimeSlots = async () => {
    if (!labID || !selectedDate) return;
  
    setLoading(true);
    try {
      // Assuming you need to pass an authentication token
      const token = localStorage.getItem("token"); // Check if a token is available
      const slotsResponse = await axiosConfig.get(
        `/labs/${labID}/time_slots?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        }
      );
      setTimeSlots(slotsResponse.data.data.available_slots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Check login status before fetching time slots
  const handleLoginDependentData = async () => {
    const isLoggedIn = checkLoginStatus();
    if (isLoggedIn) {
      fetchTimeSlots(); // Only fetch time slots if the user is logged in
    }
  };
  
  // Call these functions separately in useEffect
  useEffect(() => {
    fetchLabsData(); // Fetch lab data regardless of login status
    fetchMembers(); // Fetch members when the modal is shown
    handleLoginDependentData(); // Fetch time slots only if logged in
  }, [labID, selectedDate]);
  
  // Check login status
  const checkLoginStatus = () => {
    const userId = localStorage.getItem("userid");
    const authToken = localStorage.getItem("token"); // Add token check if required
    if (userId && authToken) {
      setIsLoggedIn(true); // User is logged in
      return true;
    } else {
      setIsLoggedIn(false); // User is not logged in
      return false;
    }
  };
  

  const fetchMembers = async () => {
    try {
      const response = await axiosConfig.get("/members");
      if (response.data.status.code === 200) {
        setMembers(response.data.data); // Update members state with API data
      } else {
        console.error("Error fetching members:", response.data.status.message);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    if (labLists.length > 0 && labID) {
      const lab = labLists.find((lab) => lab.id === parseInt(labID, 10));
      setSelectedLab(lab);
    }
  }, [labLists, labID]);

  const handleRemoveFromCart = (id) => {
    // Remove item from cartData
    const updatedCartData = cartData.filter((item) => item.id !== id);
    setCartData(updatedCartData);
    localStorage.setItem("cartData", JSON.stringify(updatedCartData));

    // Remove item from cart
    const updatedCart = cart.filter((item) => item !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.removeItem("selectedLab");
    setLabID("");
    console.log(`Item with id: ${id} removed from the cart`);

    // Redirect if cart becomes empty after removing items
    if (updatedCart.length === 0 || updatedCartData.length === 0) {
      navigate("/pathology/lab-test");
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

  const handleMemberSelection = (id) => {
    setSelectedMember(id);
  };

  const handleConfirmSelection = async () => {
    if (!selectedMember) {
      alert("Please select a member.");
      return;
    }
    localStorage.setItem("selectedMember", selectedMember);
    localStorage.setItem("labid", labID);
    localStorage.setItem("bookingDate", selectedDate);
    localStorage.setItem("bookingSlot", selectedTimeSlot);
    localStorage.setItem("appointmentType", appointmentType);
    handleCloseModal(); // Close the modal after successful booking
    navigate(`/pathology/lab-test/book/`);
  };

  const handleLabClick = () => {
    setIsModalOpen(true);
  };

  const handleLabCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogingRedirect = (redirectURL) => {
    localStorage.setItem("redirectURL", redirectURL);
    navigate("/login");
  };
  console.log(labLists);

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Layout>
      <nav className="navbar navbar-expand-lg shadow-none bg-white detail-y">
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
                <a href="#">Lab Test</a>
              </li>
              <li>/</li>
              <li
                className="breadcrumb-item active-bradcurmb"
                aria-current="page"
              >
                <a href="#">Cart</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {cartData.map((test) => (
                <div
                  className="blood-sugar d-lg-flex align-items-center justify-content-between"
                  key={test.id}
                >
                  <div className="d-lg-flex align-items-center">
                    <div className="image-blood-sugar">
                      <img src="/img/blood-sugar.svg" alt={test.name} />
                    </div>
                    <div className="blood-details">
                      <h3>{test.name}</h3>
                      <p>
                        <span>Type:</span> {test.type_of_test}
                      </p>
                      <div>
                        <p>Reports in {test.report_time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="center-blood">
                    <p>
                      Best price : <span>₹{test.best_price}</span>
                    </p>
                  </div>
                  <a
                    className="add-btn align-self-start btn-blood"
                    href="#"
                    onClick={() => handleRemoveFromCart(test.id)}
                  >
                    Remove
                  </a>
                </div>
              ))}
            </div>

            {/* Sidebar */}

            <div className="col-lg-4">
              {!selectedLab && (
                <div className="timeslots">
                  <h2 className="m-0 bookbtn">Book Lab Test</h2>
                  <div className="border-bottom mb13"></div>
                  <div className="alert alert-danger w-100" role="alert">
                    Please select a lab
                  </div>
                  <div className="d-xl-flex gap-3 mb-15">
                    <button
                      className="mb-xl-0 mb-2 buttonCustom w-100"
                      onClick={handleLabClick}
                    >
                      Select Lab
                    </button>
                  </div>
                </div>
              )}

              {selectedLab && (
                <div className="book-consultation">
                  <div className="d-flex justify-content-between align-items-center mb-3 editdark">
                  <h2 className="m-0 bookbtn pb-0 text-dark">Selected Lab</h2>
                  <a className="d-flex gap-1" href="#"  onClick={handleLabClick} >Change Lab<img src="/img/edit.svg" /></a>
                  </div>
                  <div className="border-bottom mb13"></div>
                  <span className="mb-2 d-block">{selectedLab.name} </span>

                  {selectedLab.addresses &&
                    selectedLab.addresses.length > 0 && (
                      <span className="mb-2 d-block">
                        {selectedLab.addresses[0].name}{" "}
                        {selectedLab.addresses[0].address_line1}{" "}
                        {selectedLab.addresses[0].pin_code}{" "}
                        {selectedLab.addresses[0].city_state}
                      </span>
                    )}

                  
                </div>
              )}

              {selectedLab && (
                <>
                  <div className="book-consultation">
                    <h2 className="m-0 bookbtn">Book Lab Test</h2>
                    <div className="border-bottom mb13"></div>
                    <div className="d-xl-flex gap-3 mb-15">
                      <button
                        className={`fixwidth mb-xl-0 mb-2 buttonCustom ${
                          selectedTab === "home" ? "" : "btn-clinic"
                        }`}
                        onClick={() => setSelectedTab("home")}
                      >
                        Home Sample
                      </button>
                      <button
                        className={`fixwidth mb-0 buttonCustom ${
                          selectedTab === "lab" ? "" : "btn-clinic"
                        }`}
                        onClick={() => setSelectedTab("lab")}
                      >
                        Visit Lab
                      </button>
                    </div>

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

                  {isLoggedIn ? (
                    <div className="timeslots">
                      <h2 className="m-0 bookbtn">
                        {timeSlots.length} Time slots available
                      </h2>
                      {timeSlots.length > 0 ? (
                        <>
                          <div className="d-flex justify-content-between flex-wrap gaps">
                            {timeSlots.map((time, index) => (
                              <div
                                key={index}
                                className={`time ${
                                  selectedTimeSlot === time ? "divCustom" : ""
                                }`}
                                onClick={() => handleTimeSlotClick(time)}
                              >
                                <span>{time}</span>
                              </div>
                            ))}
                          </div>

                          {/* Show booking buttons for Home Sample or Visit Lab */}
                          <div className="d-xl-flex gap-3">
                            <button
                              className={`cart-btn fixwidth mb-xl-0 mb-2 border-0 disable-color ${
                                selectedTab === "home" ? "" : "btn-clinic"
                              } `}
                              onClick={() => handleShowModal("Home Sample")}
                              disabled={!selectedTimeSlot}
                            >
                             Home Sample
                            </button>
                            <button
                              className={`cart-btn btn-clinic fixwidth mb-0 bookclinic ${
                                selectedTab === "lab" ? "" : "btn-clinic"
                              } fixwidth mb-0`}
                              onClick={() => handleShowModal("Visit Lab")}
                              disabled={!selectedTimeSlot}
                            >
                              Visit Lab
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="no-timeslot">
                          No timeslots available
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="timeslots">
                      <button
                        className="buttonCustom cart-btn  mb-0 align-center w-100"
                        onClick={() =>
                          handleLogingRedirect("pathology/lab-test/cart")
                        }
                      >
                        Login to Book Lab Test
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {showModal && <AddressModel onClose={handleCloseModal} />}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {members.length > 0 ? (
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
          ) : (
            <div>No members found.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn-clinic"
            onClick={handleCloseModal}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className="buttonCustom"
            onClick={handleConfirmSelection}
            disabled={!selectedMember} // Disable button if no member is selected
          >
            Confirm Selection
          </Button>
        </Modal.Footer>
      </Modal>
      <LabListModel
        isOpen={isModalOpen}
        onClose={handleLabCloseModal}
        onLabSelected={(labId) => setLabID(labId)} // Update parent state with selected lab
      />
    </Layout>
  );
}

export default LabTestReview;
