import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosToken";
import { useParams, useNavigate } from "react-router-dom";
import PromoModel from "../Cart/PromoModel";
import AddressModel from "../../components/AddressModel";

function LabTestConfirm() {
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate(); // For navigation
  const [labLists, setLabLists] = useState([]); // For labTests
  const [labID, setLabID] = useState("");
  const [promo, setPromo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null); // For single lab details
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(
    localStorage.getItem("selectedAddress")
  ); // Track selected address
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

  const getLabLists = async () => {
    try {
      const response = await axiosConfig.get(`/labs`);
      setLabLists(response.data.data);
    } catch (error) {
      console.error("Error fetching lab lists:", error);
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
        `/lab_test_bookings/${localStorage.getItem("labBookId")}`
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
      const response = await axiosConfig.put(`/lab_test_bookings/${bookingID}/confirm_booking`);
      //here call api for payment

      const order_id = response.data.data.razorpay_booking_id; // Example order ID
      const amount = bookings.price_details.total; // Example amount in paise (e.g., 500.00 INR)
      const currency = "INR"; // Currency code
      const customerName = customerData.name || "N/A"; // Customer's name
      const customerEmail = customerData.email || "N/A"; // Customer's email
      const customerContact = customerData.phone_number || "N/A"; // Customer's contact number
      initiateRazorpayPayment(order_id, amount, currency, customerName, customerEmail, customerContact);
    } catch ( error ) { 
      setLoading(false);

      console.error("Error placing order:", error); 
    }
  }


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
      amount: amount*100, // Amount in paise
      currency: currency, // Currency (e.g., "INR")
      name: "Niramaya Soul", // Replace with your company name
      description: "Lab Test Booking Payment Description", // Replace with your transaction description
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
            "/payment_details/capture_lab_test_booking_payment",
            paymentDetails
          );

          // Check if the capture was successful
          if (captureResponse.data.status.code == 200) {
            setLoading(false);

            alert(captureResponse.data.status.message); // Show the success message from the response
            //remove booking id from localstorage
            ['appointmentType', 'bookingDate', 'bookingSlot', 'cart', 'cartData', 'labBookId', 'labid', 'selectedAddress', 'selectedLab', 'selectedMember']
            .forEach(item => localStorage.removeItem(item));
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
      navigate("/error");
      console.error(response.error);
    });
  };

  console.log(selectedAddress);
  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    ); // Show loader overlay
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
                <a href="#">Test Details</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
            <div className="label-cart d-flex justify-content-between align-items-center">
                {addresses ? (
                  <>
                    <span>
                      {addresses.name}, {addresses.address_line1},{" "}
                      {addresses.city_state}, {addresses.pin_code},{" "}
                      {addresses.landmark}, {addresses.phone_number}
                    </span>
                    
                  </>
                ) : (
                  // If no address is selected, show prompt to add an address
                  <span>
                    Please provide your address to confirm delivery of the item.
                  </span>
                )}

                
              </div>
              {bookings.lab_test_booking_items.map((test) => (
                <div
                  className="blood-sugar d-lg-flex align-items-center justify-content-between"
                  key={test.id}
                >
                  <div className="d-lg-flex align-items-center">
                    <div className="image-blood-sugar">
                      {/* Display the lab-specific image from the test's first available lab */}
                      <img
                        src={test.lab_test.labs[0]?.image_url}
                        alt={test.lab_test.name}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </div>
                    <div className="blood-details">
                      <h3>{test.lab_test.name}</h3>
                      <p>
                        <span>Type:</span> {test.lab_test.type_of_test}
                      </p>
                      <div>
                        <p>Reports in {test.lab_test.report_time || "24 hours"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="center-blood">
                    <p>
                      Best price : <span>₹{test.lab_test.best_price}</span>
                    </p>
                    <p>
                      MRP : <span>₹{test.lab_test.mrp}</span>
                    </p>
                  </div>
                  <div className="center-blood">
                    <p>
                      Date Slot : <span>{test.date_slot}</span>
                    </p>
                    <p>
                      Time Slot : <span>{test.time_slot}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              <div className="book-consultation">
                <h2 className="m-0 bookbtn">Selected Lab</h2>
                <div className="d-flex justify-content-between align-items-center list-page mb-0">
                  <div className="d-flex gap13">
                    {/* Lab Image */}
                    <img
                      src={bookings.lab?.image_url}
                      alt={bookings.lab?.name}
                      className="img-fluid w-25"
                    />
                    <div className="cupon-content">
                      <p className="m-0">{bookings.lab?.name}</p>
                      {/* Lab Address */}
                      {bookings.lab_location ? (
                        <span>
                          {bookings.lab_location.address
                            ? bookings.lab_location.address
                            : ""}
                        </span>
                      ) : (
                        <span>No address available</span>
                      )}
                    </div>
                  </div>
                  {/* Arrow Icon */}
                  <img src="/img/arrowgreen.svg" alt="" />
                </div>
              </div>

              <div className="book-consultation">
                <h2 className="m-0 bookbtn">Patient Details</h2>
                <div className="d-flex justify-content-between align-items-center list-page mb-0">
                  <div className="d-flex gap13">
                    <div className="cupon-content">
                      <p className="m-0">
                        {bookings.member?.name || "N/A"}{" "}
                        <span className="text-center">
                          {bookings.member?.gender || "N/A"}{" "}
                          {bookings.member?.age || "N/A"}{" "}
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
                      <span>₹ {bookings?.price_details?.total_mrp}</span>
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
                      <span>₹ {bookings?.price_details?.total_price}</span>
                    </li>
                  </ul>
                </div>

                <div className="border-bottom w-100 mb-25"></div>

                {/* Total Payable Section */}
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div className="d-flex flex-column totalpayble">
                    <span>Total payable</span>
                    <p className="m-0">
                      ₹ {bookings?.price_details?.total_price}
                    </p>
                  </div>
                  <button className="applyfor m-0" onClick={handlePayNow}>
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> 
      <PromoModel
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promoType={"lab test booking"}
        bookingID={bookingID}
        fetchBookings={getBookings}
      />
    </Layout>
  );
}

export default LabTestConfirm;
