import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosToken";
import { Link,useParams, useNavigate, useLocation } from "react-router-dom";
import PromoModel from "../Cart/PromoModel";
import AddressModel from "../../components/AddressModel";
const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
function PackageBookingConfirm() {
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate(); // For navigation
  const location = useLocation();

  const { packageId } = location.state || {}; // Access the passed packageId
  const { packagename } = useParams();
  const [labLists, setLabLists] = useState([]); // For labTests
  const [packageDetails, setPackageDetails] = useState({});
  const [labID, setLabID] = useState("");
  const [promo, setPromo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null); // For single lab details
  const [popularPackages, setPopularPackages] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(
    localStorage.getItem("selectedAddress")
  ); // Track selected address
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // For address popup
  const [members, setMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingID, setBookingID] = useState("");
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    // Call all necessary API calls concurrently using Promise.all for better performance
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        getLabLists(),
        getPackageDetails(),
        getPopularPackages(),
        getPromo(),
        getMembers(),
        getAddress(),
        getBookings(),
        getCustomerDetails(),
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMembers = async () => {
    const memberId = localStorage.getItem("selectedMember");
    try {
      const response = await axiosConfig.get(`/members/${memberId}`);
      setMembers(response.data.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const getAddress = async () => {
    try {
      const response = await axiosConfig.get(
        `/addresses/${localStorage.getItem("selectedAddress")}`
      );
      setAddresses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedAddress(response.data.data); // Set default address as selected
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    // Find the lab with the matching labID
    if (labLists.length > 0 && labID) {
      const lab = labLists.find((lab) => lab.id === labID); // Adjust 'id' as per your actual key
      setSelectedLab(lab);
    }
  }, [labLists, labID]); // Depend on labLists and labID

  const getPackageDetails = async () => {
    try {
      const response = await axiosConfig.get(`/packages/${packageId}`);
      setPackageDetails(response.data.data);
      setLabID(response.data.data.lab_id);
    } catch (error) {
      console.error("Error fetching package details:", error);
    }
  };

  const getLabLists = async () => {
    try {
      const response = await axiosConfig.get(`/labs`);
      setLabLists(response.data.data);
    } catch (error) {
      console.error("Error fetching lab lists:", error);
    }
  };

  const getPopularPackages = async () => {
    try {
      const response = await axiosConfig.get(`/packages/popular_packages`);
      setPopularPackages(response.data.data);
    } catch (error) {
      console.error("Error fetching popular packages:", error);
    }
  };

  const getPromo = async () => {
    try {
      const response = await axiosConfig.get("/coupons");
      setPromo(response.data.data);
    } catch (error) {
      console.error("Error checking promo availability:", error);
    }
  };

  const getBookings = async () => {
    try {
      const response = await axiosConfig.get(
        `/bookings/${localStorage.getItem("packageBookId")}`
      );
      setBookingID(response.data.data.id);
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

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

  const handleAddressChangeClick = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressClose = () => {
    setIsAddressModalOpen(false);
  };

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
      const amount = bookings.price_details.total; // Example amount in paise (e.g., 500.00 INR)
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
      description: "Package Booking Payment Description", // Replace with your transaction description
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
            [
              "addressesid",
              "appointmentType",
              "bookingDate",
              "bookingSlot",
              "labid",
              "package_id",
              "packageBookId",
              "selectedAddress",
              "selectedMember",
            ].forEach((item) => localStorage.removeItem(item));
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
              {localStorage.getItem("appointmentType") === "Home Sample" ? (
                <>
                  <div className="label-cart d-flex flex-column justify-content-between align-items-start">
                    {addresses ? (
                      <>
                        <span className="pb-2">
                          <strong>Home</strong>
                        </span>
                        <span>
                          <img className="me-2" src="/img/address.svg" />
                          {addresses.name}, {addresses.address_line1}{" "}
                          {addresses.city_state} {addresses.pin_code}{" "}
                          {addresses.landmark} {addresses.phone_number}
                        </span>
                      </>
                    ) : (
                      // If no address is selected, show prompt to add an address
                      <span>
                        Please provide your address to confirm delivery of the
                        item.
                      </span>
                    )}
                  </div>
                </>
              ) : null}
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
                  <p>Test Mode</p>
                  <p>
                    <span>{localStorage.getItem("appointmentType")}</span>
                  </p>
                </div>
                <div className="center-blood">
                  <p>Date & time</p>
                  <p>
                    <span>
                      {localStorage.getItem("bookingDate")} -{" "}
                      {localStorage.getItem("bookingSlot")}
                    </span>
                  </p>
                </div>
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
                <h2 className="m-0 bookbtn">Selected Lab</h2>
                <div className="d-flex justify-content-between align-items-center list-page mb-0">
                  <div className="d-flex gap13">
                    <img
                      src={packageDetails.lab.image_url}
                      alt={packageDetails.lab.name}
                      className="img-fluid w-25"
                    />
                    <div className="cupon-content">
                      <p className="m-0">{packageDetails.lab.name}</p>
                      {selectedLab &&
                      selectedLab.addresses &&
                      selectedLab.addresses.length > 0 ? (
                        <span>
                          {selectedLab.addresses[0].name
                            ? selectedLab.addresses[0].name
                            : ""}{" "}
                          {selectedLab.addresses[0].address_line1
                            ? selectedLab.addresses[0].address_line1
                            : ""}{" "}
                          {selectedLab.addresses[0].pin_code
                            ? selectedLab.addresses[0].pin_code
                            : ""}{" "}
                          {selectedLab.addresses[0].city_state
                            ? selectedLab.addresses[0].city_state
                            : ""}
                        </span>
                      ) : (
                        <span>No address available</span>
                      )}
                    </div>
                  </div>

                  <img src="/img/arrowgreen.svg" alt="" />
                </div>
              </div>
              <div className="book-consultation">
                <h2 className="m-0 bookbtn">Patient Details</h2>
                <div className="d-flex justify-content-between align-items-center list-page mb-0">
                  <div className="d-flex gap13">
                    <div className="cupon-content">
                      <p className="m-0">
                        {members ? members.name : "N/A"}{" "}
                        <span className="text-center">
                          {" "}
                          {members ? members.gender : "N/A"}{" "}
                          {members ? members.age : "N/A"}{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                  <img src="/img/arrowgreen.svg" alt="" />
                </div>
              </div>

              {promo.length > 0 ? (
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

              <div className="timeslots">
                <h2 className="m-0 bookbtn">Total Charges</h2>
                <div className="d-flex justify-content-between flex-column w-100">
                  {/* Lab Test Fee */}
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                    <li>Labtest Fee</li>
                    <li>
                      <span>₹ {bookings?.price_details?.consult_fees}</span>
                    </li>
                  </ul>

                  {/* Platform Fee */}
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                    <li>Platform Fee</li>
                    <li>
                      <span>₹ {bookings?.price_details?.platform_fees}</span>
                    </li>
                  </ul>

                  {/* Coupon Discount (conditionally rendered if > 0) */}
                  {bookings?.price_details?.coupon_discount > 0 && (
                    <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                      <li>Coupon Discount</li>
                      <li>
                        <span>
                          - ₹{bookings?.price_details?.coupon_discount}
                        </span>
                      </li>
                    </ul>
                  )}

                  <div className="border-bottom w-100 mb-25"></div>

                  {/* Total Pay */}
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalpay">
                    <li>Total Pay</li>
                    <li>
                      <span>₹ {bookings?.price_details?.total}</span>
                    </li>
                  </ul>
                </div>

                <div className="border-bottom w-100 mb-25"></div>

                {/* Total Payable Section */}
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div className="d-flex flex-column totalpayble">
                    <span>Total payable</span>
                    <p className="m-0">₹ {bookings?.price_details?.total} </p>
                  </div>
                  <button className="applyfor m-0" onClick={handlePayNow}>
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between align-items-center mb319">
                <h3 className="ptest">Popular Tests</h3>
                <a className="btn-more btn-load-more" href="#">
                  View All
                </a>
              </div>
            </div>
          </div>
          <div className="row mb-48 g-4">
            {popularPackages.slice(0, 4).map((packageData) => (
              <div key={packageData.id} className="col-lg-3 d-flex">
                <div className="test-main">
                  <div className="d-flex mb-20">
                    <div className="img-group">
                      <img
                        src={packageData.image_url}
                        alt={packageData.name}
                        className="img-fluid"
                      />
                    </div>
                    <div className="text-total">
                      <h3>{packageData.name}</h3>
                      <p>Type: {packageData.requirement}</p>
                      {/* Placeholder for other package info, if any */}
                      <span>Reports in 24 hrs</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-16">
                    <div className="tot-price">
                      {/* Display "Top Deal" only if there's a discount */}
                      {packageData.actual_price !==
                        packageData.selling_price && <span>Top Deal</span>}
                      <div className="price-amount">
                        <p className="mb-0">
                          {/* Dynamic Pricing: Show selling price and MRP if different */}
                          <span className="pricefix">
                            ₹
                            {packageData.selling_price ||
                              packageData.actual_price}
                          </span>
                          {packageData.actual_price &&
                            packageData.selling_price &&
                            packageData.actual_price !==
                              packageData.selling_price && (
                              <>
                                <span className="price-delete">
                                  <del>(₹{packageData.actual_price})</del>
                                </span>
                                {/* <span className="off">
                                        ₹
                                        {item.discount}% off
                                        OFF
                                      </span> */}
                              </>
                            )}
                        </p>
                      </div>
                    </div>
                    <Link
                      className="add-btn"
                      to={`/pathology/packages/details/${toSlug(packageData.name)}`}
                      state={{ packageId: packageData.id }}
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="card-footers">
                    <div className="footer-img">
                      <img
                        src={packageData.lab.image_url}
                        alt={packageData.lab.name}
                        className="img-fluid"
                      />
                    </div>
                    <span>By {packageData.lab.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PromoModel
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promoType={"Booking"}
        bookingID={bookingID}
        fetchBookings={getBookings}
      />
      <AddressModel
        isOpen={isAddressModalOpen}
        onClose={handleAddressClose}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress} // Pass setSelectedAddress function to the child
      />{" "}
    </Layout>
  );
}

export default PackageBookingConfirm;
