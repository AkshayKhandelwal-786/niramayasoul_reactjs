import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosConfig";
import axiosToken from "../../services/axiosToken";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { Modal, Button } from "react-bootstrap"; // If using Bootstrap, import these
const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};
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

function DoctorProfile() {
  const location = useLocation();
  const { doctorId: statedoctorId } = location.state || {};
  const doctorId = statedoctorId || localStorage.getItem("doctorId");

  const navigate = useNavigate(); // For navigation

  const [loading, setLoading] = useState(true);
  const [docProfile, setDoctor] = useState([]);
  const [selectedTab, setSelectedTab] = useState("clinic");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // Add state for selected time slot
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const [members, setMembers] = useState([]); // State to hold members data
  const [selectedMember, setSelectedMember] = useState(null); // State to hold selected member
  const [appointmentType, setAppointmentType] = useState(""); // Set this based on button clicked

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  useEffect(() => {
    getDoctor();
    fetchTimeSlots();
    fetchMembers(); // Fetch members when the modal is shown
  }, [selectedDate, selectedTab]);

  const fetchTimeSlots = async () => {
    try {
      const response = await axiosToken.get(
        `/doctors/${doctorId}/time_slots?date=${selectedDate}`
      );

      if (response.data.status.code === 200) {
        setTimeSlots(response.data.data.available_slots);
      } else {
        console.error(
          "Error fetching time slots:",
          response.data.status.message
        );
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const getDoctor = async () => {
    try {
      const response = await axiosConfig.get(`/doctors/${doctorId}`);
      setDoctor(response.data.data); // Set the doctor state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  //fetch memeber
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

  function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <div className="starating">
        {[...Array(fullStars)].map((_, index) => (
          <a href="#" key={index}>
            <img src="/img/start-rating.svg" alt="Full Star" />
          </a>
        ))}
        {halfStar === 1 && (
          <a href="#">
            <img src="/img/star-half.svg" alt="Half Star" />
          </a>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <a href="#" key={index}>
            <img src="/img/star-empty.svg" alt="Empty Star" />
          </a>
        ))}
      </div>
    );
  }

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

    setLoading(true);

    const bookingData = {
      booking: {
        time_slot: selectedTimeSlot,
        date_slot: selectedDate, // Use today's date or adjust as needed
        appointment_type: appointmentType,
        payment_type: "paid_online",
        platform_fee: 80.0,
      },
      doctor_id: doctorId,
      member_id: selectedMember,
    };

    try {
      const response = await axiosToken.post("/book_appointment", bookingData);
      if (response.data.status.code == 201) {
        setLoading(false);
        localStorage.setItem("book_appointment", response.data.data.id);
        handleCloseModal(); // Close the modal after successful booking
        navigate(
          `/doctors/profile/${toSlug(docProfile.address.name)}/appointment/`,
          { state: { doctorId: doctorId } }
        );
      } else {
        setLoading(false);

        console.error(
          "Error booking appointment:",
          response.data.status.message
        );
      }
    } catch (error) {
      setLoading(false);

      console.error("Error booking appointment:", error);
    }
  };

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
    if (!newMember.name || !newMember.age || !newMember.dob || !newMember.gender || !newMember.phone_number) {
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
    localStorage.setItem("doctorId", doctorId);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    ); // Show loader overlay
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
                <a href="#">Doctor Listing</a>
              </li>
              <li>/</li>
              <li
                className="breadcrumb-item active-bradcurmb"
                aria-current="page"
              >
                <a href="#">Doctor Profile</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      <div className="profile-cover">
        <div className="container">
          <div className="profle-bg">
            <div className="row">
              <div className="col-lg-12">
                <div className="profile-main">
                  <img
                    className="img-fluid"
                    src={docProfile.image_url ? docProfile.image_url : ""}
                    alt="profile-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mts">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="doc-profile-disc">
                <span className="badge badge-primary bagde-pro">
                  {docProfile.specialities
                    ? docProfile.specialities
                        .map((speciality) => speciality.name)
                        .join(", ")
                    : ""}
                </span>

                <div className="profile-title mb-lg-3 mb-xl-0 mb-4">
                  <h2> {docProfile.address ? docProfile.address.name : ""}</h2>
                  <span>
                    {docProfile.education ? docProfile.education : ""}
                  </span>
                  <div className="location-profile">
                    <span>
                      <img src="/img/location.svg" />
                      {docProfile.location ? docProfile.location : ""}
                    </span>

                    <div className="d-flex align-items-center gap-1 mb-3">
                      <StarRating rating={docProfile.rating} />
                      <span className="rating-counter">
                        {docProfile.rating}
                      </span>
                    </div>
                  </div>
                  <div className="price-profile">
                    <p className="d-flex align-items-center">
                      ₹{docProfile.fee}
                      <span>Fee</span>
                    </p>
                  </div>
                  <div className="offers">
                    <div className="row gy-lg-0 gy-3 mb-4">
                      <div className="col-lg-6 d-flex">
                        <div className="offer-card d-flex align-items-center w-100 offer-profile">
                          <img src="/img/broad.svg" alt="offer" />
                          <div className="text-offer">
                            <h5>Broad range of Specialities</h5>
                            <p className="m-0">
                              Manage allergies and treat immunity
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 d-flex">
                        <div className="offer-card d-flex align-items-center w-100 bg-g offer-profile">
                          <img src="/img/digi.svg" alt="offer" />
                          <div className="text-offer">
                            <h5>Digitised health records</h5>
                            <p className="m-0">
                              Manage allergies and treat immunity
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-bottom mb19"></div>
                  <div className="about-doctor mb25">
                    <span>
                      <img src="/img/usericon.svg" alt="" />
                      About Doctor
                    </span>
                    <p>
                      {docProfile.description ? docProfile.description : ""}
                    </p>
                  </div>
                  <div className="border-bottom mb19"></div>

                  <div className="row mb87">
                    <div className="col-lg-12">
                      <div className="shadow-none">
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="work-experance d-flex flex-column">
                              <p className="d-flex align-items-center gap-2">
                                <img src="/img/work.svg" alt="" />
                                Work & Experience
                              </p>
                              <span>{docProfile.work_exp} Years</span>
                            </div>
                          </div>
                          <div className="col-lg-5">
                            <div className="work-experance d-flex flex-column">
                              <p className="d-flex align-items-center gap-2">
                                <img src="/img/education.svg" alt="" />
                                Education
                              </p>
                              <span>
                                {" "}
                                {docProfile.education
                                  ? docProfile.education
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-bottom mb19"></div>
                  <div className="row mb87">
                    <div className="col-lg-12">
                      <div className="shadow-none">
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="work-experance d-flex flex-column">
                              <p className="d-flex align-items-center gap-2">
                                <img src="/img/award.svg" alt="" />
                                Awards
                              </p>
                              <span>
                                {docProfile.awards ? docProfile.awards : "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-5">
                            <div className="work-experance d-flex flex-column">
                              <p className="d-flex align-items-center gap-2">
                                <img src="/img/clinic.svg" alt="" />
                                Clinic Details
                              </p>
                              <span>
                                {docProfile.address.name +
                                  ", " +
                                  docProfile.address.address_line1 +
                                  ", " +
                                  docProfile.address.city_state +
                                  ", " +
                                  docProfile.address.pin_code}{" "}
                                {}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="gray-disc bgwhite">
                    <h4>
                      <img src="/img/doctor-online.svg" alt="" />
                      How to consult a doctor online via ?
                    </h4>
                    <div className="list-details mb-0">
                      <ul className="ps-3 mb-0">
                        <li>Choose the doctor</li>
                        <li>Book a slot</li>
                        <li>Make payment</li>
                        <li>
                          Be present in the consult room on apollo247.com at the
                          time of consult
                        </li>
                        <li>Follow Up via text - Valid upto 7 days</li>
                      </ul>
                    </div>
                  </div> */}

                  {/* <div className="row mb38">
                    <div className="col-lg-12">
                      <h4 className="titlefield">
                        <img src="/img/field.svg" alt="" />
                        Field of Expertise
                      </h4>
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <div className="card-garys d-flex align-items-center">
                            <img src="/img/arrow-field.svg" />
                            <div className="grays-text">
                              <p className="m-0">
                                Allergist and Clinical Immunologist
                              </p>
                              <span>Manage allergies and treat immunity</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card-garys d-flex align-items-center">
                            <img src="/img/arrow-field.svg" />
                            <div className="grays-text">
                              <p className="m-0">Marital counselling</p>
                              <span>Manage allergies and treat immunity</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card-garys d-flex align-items-center">
                            <img src="/img/arrow-field.svg" />
                            <div className="grays-text">
                              <p className="m-0">Intellectual disability</p>
                              <span>Manage allergies and treat immunity</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card-garys d-flex align-items-center">
                            <img src="/img/arrow-field.svg" />
                            <div className="grays-text">
                              <p className="m-0">Parental counselling</p>
                              <span>Manage allergies and treat immunity</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card-garys d-flex align-items-center">
                            <img src="/img/arrow-field.svg" />
                            <div className="grays-text">
                              <p className="m-0">Psycho-oncology cases</p>
                              <span>Manage allergies and treat immunity</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card-garys d-flex align-items-center">
                            <img src="/img/arrow-field.svg" />
                            <div className="grays-text">
                              <p className="m-0">
                                Geriatric psychological disorders
                              </p>
                              <span>Manage allergies and treat immunity</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordin-details mb56">
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
                                checkers, calorie counters, and fitness
                                trackers. You can access these tools under the
                                "Health Tools" section of our website.
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
                              Is the health information on your website?{" "}
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
                                Our website offers various tools such as symptom
                                checkers, calorie counters, and fitness
                                trackers. You can access these tools under the
                                "Health Tools" section of our website.
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
                              Do you provide website maintenance services?
                              <img id="plus" src="/img/plus.svg" alt="" />{" "}
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
                                checkers, calorie counters, and fitness
                                trackers. You can access these tools under the
                                "Health Tools" section of our website.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingfour">
                            <button
                              data-mdb-collapse-init
                              className="accordion-button collapsed justify-content-between"
                              type="button"
                              data-mdb-toggle="collapse"
                              data-mdb-target="#collapsefour"
                              aria-expanded="true"
                              aria-controls="collapsefour"
                            >
                              Can I get personalized health advice on this
                              website?
                              <img id="plus" src="/img/plus.svg" alt="" />{" "}
                              <img id="minus" src="/img/minus.svg" alt="" />
                            </button>
                          </h2>
                          <div
                            id="collapsefour"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingfour"
                            data-mdb-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>
                                Our website offers various tools such as symptom
                                checkers, calorie counters, and fitness
                                trackers. You can access these tools under the
                                "Health Tools" section of our website.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingfive">
                            <button
                              data-mdb-collapse-init
                              className="accordion-button collapsed justify-content-between"
                              type="button"
                              data-mdb-toggle="collapse"
                              data-mdb-target="#collapsefive"
                              aria-expanded="true"
                              aria-controls="collapsefive"
                            >
                              How is my privacy protected on your website?
                              <img id="plus" src="/img/plus.svg" alt="" />{" "}
                              <img id="minus" src="/img/minus.svg" alt="" />
                            </button>
                          </h2>
                          <div
                            id="collapsefive"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingfive"
                            data-mdb-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>
                                Our website offers various tools such as symptom
                                checkers, calorie counters, and fitness
                                trackers. You can access these tools under the
                                "Health Tools" section of our website.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="rating-area d-flex flex-lg-row flex-column justify-content-between align-items-center">
                    <div className="rating-main d-flex align-items-center">
                      <p className="m-0">
                        4.8<span>/5</span>
                      </p>
                      <div className="rating-overall">
                        <p className="m-0">Overall Rating</p>
                        <span>574 Ratings</span>
                      </div>
                    </div>
                    <a className="applyfor m-0" href="#">
                      Rate Us
                    </a>
                  </div>
                  <div className="comments col-10 col-lg-6">
                    <div className="comment-rating d-flex align-items-center gap-1">
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                    </div>
                    <div className="commentsview">
                      <h5>Amazing Doctor!</h5>
                      <p>
                        An amazing fit. I am somewhere around 6ft and ordered 40
                        size, It's a perfect fit and quality is worth the
                        price...
                      </p>

                      <span>David Johnson, 1st April 2024</span>
                    </div>
                  </div>
                  <div className="border-bottom mb19"></div>

                  <div className="comments col-10 col-lg-6">
                    <div className="comment-rating d-flex align-items-center gap-1">
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                      <a href="#">
                        <img src="/img/comment-star.svg" alt="" />
                      </a>
                    </div>
                    <div className="commentsview">
                      <h5>Amazing Doctor!</h5>
                      <p>
                        An amazing fit. I am somewhere around 6ft and ordered 40
                        size, It's a perfect fit and quality is worth the
                        price...
                      </p>

                      <span>David Johnson, 1st April 2024</span>
                    </div>
                  </div>
                  <div className="border-bottom mb19"></div>
                  <a className="viewall" href="#">
                    View All 129
                  </a> */}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="book-consultation">
                <h2 className="m-0 bookbtn">Book Lab Test</h2>
                <div className="border-bottom mb13"></div>
                <div className="d-xl-flex gap-3 mb-15">
                  <button
                    className={`fixwidth mb-xl-0 mb-2 buttonCustom border-0 ${
                      selectedTab === "online" ? "" : "btn-clinic"
                    }`}
                    href="#"
                    onClick={() => setSelectedTab("online")}
                  >
                    Online Consult
                  </button>
                  <button
                    className={`cart-btn fixwidth mb-0 buttonCustom border-0 ${
                      selectedTab === "clinic" ? "" : "btn-clinic"
                    }`}
                    href="#"
                    onClick={() => setSelectedTab("clinic")}
                  >
                    Visit Clinic
                  </button>

                  {/* check selected tab and show lab address if tab is lab */}
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
              <div className="timeslots">

  {/* Check if the user is logged in */}
  {localStorage.getItem("userid") ? (
    timeSlots.length > 0 ? (
      <>
        <h2 className="m-0 bookbtn">{timeSlots.length} Time slots available</h2>

        <div className="d-flex justify-content-between flex-wrap gaps">
          {timeSlots.map((time, index) => (
            <div
              className={`time ${selectedTimeSlot === time ? "divCustom" : ""}`}
              key={index}
              onClick={() => handleTimeSlotClick(time)}
            >
              <span>{time}</span>
            </div>
          ))}
        </div>

        <div className="d-xl-flex gap-3">
          <button
            className={`buttonCustom cart ${
              selectedTab === "online" ? "" : "btn-clinic"
            } fixwidth mb-0`}
            onClick={() => handleShowModal("online consult")}
            disabled={!selectedTimeSlot} // Disable button if no time slot is selected
          >
            Book Online Consult
          </button>
          <button
            className={`buttonCustom cart ${
              selectedTab === "clinic" ? "" : "btn-clinic"
            } fixwidth mb-0`}
            onClick={() => handleShowModal("visit clinic")}
            disabled={!selectedTimeSlot} // Disable button if no time slot is selected
          >
            Book Clinic Visit
          </button>
        </div>
      </>
    ) : (
      <div className="no-timeslot">No timeslots available</div>
    )
  ) : (
    <div className="login-prompt text-center mt-4">
      <p>Please login to book your consultation</p>
      <button
        className="buttonCustom cart-btn mb-0"
        onClick={() => handleLogingRedirect(location.pathname.substring(1))}
      >
        Login to Book Appointment
      </button>
    </div>
  )}
</div>

            </div>
          </div>
        </div>
      </section>
      {/* Modal Component */}
      <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{showAddMemberForm ? "Add Member" : "Select Member"}</Modal.Title>
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
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                value={newMember.age}
                onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                className="form-control"
                value={newMember.gender}
                onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
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
                onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={newMember.phone_number}
                onChange={(e) => setNewMember({ ...newMember, phone_number: e.target.value })}
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
            <Button
              variant="outline-success"
              onClick={handleCloseModal}
            >
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

export default DoctorProfile;
