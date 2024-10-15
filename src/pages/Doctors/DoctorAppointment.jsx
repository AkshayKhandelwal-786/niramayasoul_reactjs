import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosToken";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import PromoModel from "../Cart/PromoModel";
import { Modal, Button } from "react-bootstrap"; // If using Bootstrap, import these

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

function DoctorAppointment() {
  const location = useLocation();
  const { doctorId } = location.state || {}; // Retrieve the state passed from navigate
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

  const navigate = useNavigate();
  const bookingid = localStorage.getItem("book_appointment");
  if (!bookingid) {
    navigate(`/doctors`);
  }
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({});
  const [docProfile, setDoctor] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({}); // Initialize as an empty object
  const [promo, setPromo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getCustomerDetails();
    getDoctor();
    Promo();
    fetchBookings();
  }, []);

  const getCustomerDetails = async () => {
    try {
      const response = await axiosConfig.get("/customers/profile");
      if (response.status == 200) {
        setCustomerData(response.data.data);
      } else {
        console.error("Failed to get address");
      }
    } catch (error) {
      console.error("Error getting address", error);
    }
  };

  const getDoctor = async () => {
    try {
      const response = await axiosConfig.get(`/doctors/${doctorId}`);
      setDoctor(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const Promo = async () => {
    try {
      const response = await axiosConfig.get("/coupons");
      setPromo(response.data.data);
    } catch (error) {
      console.error("Error checking promo availability", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axiosConfig.get(`bookings/${bookingid}`);
      console.log(response.data.data); // Check the structure of the API response
      setBookingDetails(response.data.data || {}); // Safely set the state
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails || !bookingDetails.price_details) {
    return <div>Loading...</div>;
  }

  const { consult_fees, platform_fees, coupon_discount, total } =
    bookingDetails.price_details;

  const handlePromoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePayNow = async () => {
    //put api confirm_booking
    try {
      setLoading(true);
      const response = await axiosConfig.put("/confirm_booking");
      //here call api for payment

      const order_id = response.data.data.razorpay_booking_id; // Example order ID
      const amount = bookingDetails.price_details.total; // Example amount in paise (e.g., 500.00 INR)
      const currency = "INR"; // Currency code
      const customerName = customerData.name || "N/A"; // Customer's name
      const customerEmail = customerData.email || "N/A"; // Customer's email
      const customerContact = customerData.phone_number || "N/A"; // Customer's contact number
      initiateRazorpayPayment(
        order_id,
        amount,
        currency,
        customerName,
        customerEmail,
        customerContact
      );
    } catch (error) {
      setLoading(false);

      console.error("Error placing order:", error);
    }
  };

  const initiateRazorpayPayment = (
    order_id,
    amount,
    currency,
    customerName,
    customerEmail,
    customerContact
  ) => {
    const options = {
      key: "rzp_live_Czy2zVVwLRsRRU", // Replace with your Razorpay key ID
      amount: amount * 100, // Amount in paise
      currency: currency, // Currency (e.g., "INR")
      name: "Niramaya Soul", // Replace with your company name
      description: "Booking Payment Description", // Replace with your transaction description
      image: "https://v2.niramayasoul.com/img/logo.png",
      order_id: order_id, // Pass the order_id received from your server
      handler: async function (response) {
        // Handle the payment success
        const paymentDetails = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          razorpay_order_id: response.razorpay_order_id,
        };

        try {
          // Make an API call to capture the payment details
          const captureResponse = await axiosConfig.post(
            "/payment_details/capture_booking_payment",
            paymentDetails
          );

          // Check if the capture was successful
          if (captureResponse.data.status.code == 200) {
            setLoading(false);

            alert(captureResponse.data.status.message); // Show the success message from the response
            //remove booking id from localstorage
            localStorage.removeItem("book_appointment");
            // Navigate to the success page with the order data
            navigate("/success", {
              state: { order: captureResponse.data.data },
            });
          } else {
            setLoading(false);

            alert(
              "Payment was successful, but capturing the payment details failed. Please contact support."
            );
            navigate("/error", {
              state: { order: captureResponse.data.data },
            });
          }
        } catch (error) {
          setLoading(false);

          console.error("Error capturing payment details:", error);
          alert(
            "Payment was successful, but an error occurred while capturing payment details. Please contact support."
          );
          navigate("/error");
        }
      },
      prefill: {
        name: customerName, // Customer's name
        email: customerEmail, // Customer's email
        contact: customerContact, // Customer's contact number
      },
      notes: {
        address: "", // Optional notes
      },
      theme: {
        color: "#F37254", // Theme color for the Razorpay popup
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      alert("Payment failed. Please try again.");
      console.error(response.error);
    });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle checkbox state
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  return (
    <Layout>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
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
                  <h2> {docProfile?.address?.name || ""}</h2>
                  <span>{docProfile?.education || ""}</span>
                  <div className="location-profile">
                    <span>
                      <img src="/img/location1.svg" alt="location" />
                      {docProfile?.location || ""}
                    </span>

                    <div className="d-flex align-items-center gap-1 mb-3">
                      <StarRating rating={docProfile?.rating} />
                      <span className="rating-counter">
                        {docProfile?.rating}
                      </span>
                    </div>
                  </div>
                  <div className="price-profile">
                    <p className="d-flex align-items-center">
                      ₹{docProfile?.fee}
                      <span>Fee</span>
                    </p>
                  </div>

                  <div className="appointment-edit">
                    <div className="row g-3 mb-243">
                      <div className="col-lg-6">
                        <div className="appointment">
                          <p>Appointment type</p>
                          <div className="d-flex align-items-center gap-6">
                            <img
                              src="/img/online-video.svg"
                              alt="appointment type"
                            />
                            <span>
                              {bookingDetails?.appointment_type || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="appointment">
                          <p>Date & time</p>
                          <div className="d-flex align-items-center gap-6">
                            <img src="/img/calander.svg" alt="calendar" />
                            <span>
                              {bookingDetails?.date_slot},{" "}
                              {bookingDetails?.time_slot}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {bookingDetails?.appointment_type === "visit clinic" && (
                      <div className="row">
                        <div className="mb-4">
                          <div className="edit-popup mb-2">
                            <p className="m-0 text-mute d-flex align-items-center"><img className="me-2" src="/img/location1.svg"></img>Clinic location</p>
                          </div>
                          <p>{bookingDetails?.doctor?.address || ""}</p>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="edit-popup">
                          <p>Patient Details</p>
                          <div className="d-flex justify-content-between align-items-center popup-card">
                            <p className="m-0">
                              {capitalizeFirstLetter(
                                bookingDetails?.member?.name || ""
                              )}
                              <span className="m-0">
                                {bookingDetails?.member?.gender},{" "}
                                {bookingDetails?.member?.age}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                            <div className="work-experance d-flex flex-column mb-lg-auto mb-3">
                              <p className="d-flex align-items-center gap-2">
                                <img src="/img/work.svg" alt="" />
                                Work & Experience
                              </p>
                              <span>{docProfile.work_exp} Years</span>
                            </div>
                          </div>
                          <div className="col-lg-5">
                            <div className="work-experance d-flex flex-column mb-lg-auto mb-3">
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
                            <div className="work-experance d-flex flex-column mb-lg-auto mb-3">
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
                            <div className="work-experance d-flex flex-column mb-lg-auto mb-3">
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
                  </div>

                  <div className="row mb38">
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
                  </div>
                  <div className="rating-area d-flex flex-lg-row flex-column justify-content-between align-items-center">
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
              {promo?.length > 0 ? (
                <div className="book-consultation" onClick={handlePromoClick}>
                  <h2 className="m-0 bookbtn">Promo Code</h2>
                  <div className="promocode d-flex justify-content-between align-items-center">
                    <div className="d-flex gap13">
                      <img src="/img/cupon.png" alt="" />
                      <div className="cupon-content">
                        <p className="m-0">Apply Coupon</p>
                        <span>View coupons</span>
                      </div>
                    </div>
                    <img src="/img/arrowgreen.svg" alt="" />
                  </div>
                </div>
              ) : null}
              <PromoModel
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                promoType={"Booking"}
                bookingID={bookingid}
                fetchBookings={fetchBookings}
              />

              <div className="timeslots">
                <h2 className="m-0 bookbtn">Total Charges</h2>
                <div className="d-flex justify-content-between flex-column w-100">
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                    <li>Consult Fee</li>
                    <li>
                      <span>₹{consult_fees}</span>
                    </li>
                  </ul>
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                    <li>Platform Fee</li>
                    <li>
                      <span>₹{platform_fees}</span>
                    </li>
                  </ul>
                  {coupon_discount > 0 && (
                    <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                      <li>Coupon Discount</li>
                      <li>
                        <span>- ₹{coupon_discount}</span>
                      </li>
                    </ul>
                  )}
                  <div className="border-bottom w-100 mb-25"></div>
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalpay">
                    <li>Total Pay</li>
                    <li>
                      <span>₹{total}</span>
                    </li>
                  </ul>
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalpay bgpay">
                    <li>Total Savings</li>
                    <li>
                      <span>₹{coupon_discount}</span>
                    </li>
                  </ul>
                </div>

                <div className="d-flex">
                  <ul className="list-unstyled mb-policy">
                    <li className="d-flex list-checkbox align-items-center check-terms">
                      <input
                        className="form-check-input me-1"
                        type="checkbox"
                        id="check-pay"
                        checked={isChecked} // Bind checked state
                        onChange={handleCheckboxChange} // Handle checkbox change
                      />
                      <label htmlFor="check-pay">
                        I agree, <span>Terms of Conditions </span>&nbsp; &nbsp;
                        <span> Privacy Policy.</span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="border-bottom w-100 mb-25"></div>

                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div className="d-flex flex-column totalpayble">
                    <span>Total payable</span>
                    <p className="m-0">₹{total}</p>
                  </div>
                  <button
                    className="applyfor m-0"
                    onClick={handlePayNow}
                    disabled={!isChecked} // Disable button if checkbox is not checked
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default DoctorAppointment;
