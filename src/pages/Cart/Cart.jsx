import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosToken";
import AddressForm from "./AddressForm";
import PromoModel from "./PromoModel";
import AddressModel from "../../components/AddressModel";
import { toast, Toaster } from "react-hot-toast";

const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};
function Cart() {
  const navigate = useNavigate(); // For navigation

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [promoCode, setPromoAvailable] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [customerData, setCustomerData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); // Track selected address
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // For address popup
  const [prescriptionFile, setPrescriptionFile] = useState(null); // For storing prescription file

  useEffect(() => {
    const userID = localStorage.getItem("userid");
    if (!userID) {
      navigate("/login"); // Redirect to login if userID is not found
      return;
    }
    fetchCartData();
    getCustomerDetails();
    checkPromo();
    getAddress();
  }, [navigate]);
  const fetchCartData = async () => {
    try {
      const response = await axiosConfig.get("/carts");
      setCart(response.data.data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  //fetch user Details
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

  const checkPrescriptionRequired = () => {
    return cart?.cart_items.some((item) => item.medicine.prescription_required);
  };

  const recalculateTotals = (cartItems) => {
    let totalMrp = 0;
    let totalDiscount = 0;
    let couponDiscount = 0;
    let shippingCharges = 0;
    let totalSavings = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.quantity * item.medicine.approx_mrp;
      totalMrp += itemTotal;
      totalDiscount += item.discount || 0;
      couponDiscount += item.coupon_discount || 0;
      shippingCharges += item.shipping_charges || 0;
      totalSavings += item.medicine.mrp - item.medicine.approx_mrp;
    });

    return {
      total_mrp: totalMrp,
      total_discount: totalDiscount,
      coupon_discount: couponDiscount,
      shipping_charges: shippingCharges,
      total: totalMrp - totalDiscount - couponDiscount + shippingCharges,
      total_savings: totalSavings,
    };
  };

  const handleQuantityChange = async (item, newQuantity) => {
    const currentQuantity = item.quantity;

    if (newQuantity > currentQuantity) {
      await increaseQuantity(item.medicine.id, newQuantity);
    } else if (newQuantity < currentQuantity) {
      await decreaseQuantity(item.medicine.id, newQuantity);
    }

    setCart((prevCart) => {
      const updatedCartItems = prevCart.cart_items.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      const updatedTotals = recalculateTotals(updatedCartItems);
      return {
        ...prevCart,
        cart_items: updatedCartItems,
        ...updatedTotals,
      };
    });
  };

  const increaseQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await axiosConfig.patch("/carts/increase_quantity", {
        medicine_id: cartItemId,
      });

      if (response.status === 200) {
        console.log("Quantity increased successfully");
        // No need to update the cart here; it will be handled in handleQuantityChange
      } else {
        console.error("Failed to increase quantity");
      }
    } catch (error) {
      console.error("Error increasing quantity", error);
    }
  };

  const decreaseQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await axiosConfig.patch("/carts/reduce_quantity", {
        medicine_id: cartItemId,
      });

      if (response.status === 200) {
        console.log("Quantity decreased successfully");
        // No need to update the cart here; it will be handled in handleQuantityChange
      } else {
        console.error("Failed to decrease quantity");
      }
    } catch (error) {
      console.error("Error decreasing quantity", error);
    }
  };

  const handleDecreaseClick = (item) => {
    const newQuantity = Math.max(item.quantity - 1, 1); // Prevents quantity from going below 1
    handleQuantityChange(item, newQuantity);
  };

  const handleIncreaseClick = (item) => {
    const newQuantity = item.quantity + 1;
    handleQuantityChange(item, newQuantity);
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await axiosConfig.delete("carts/remove_from_cart", {
        data: { medicine_id: cartItemId }, // Include payload in 'data' for DELETE requests
      });

      if (response.status === 200) {
        toast.success("Item removed successfully");
        setCart((prevCart) => {
          const updatedCartItems = prevCart.cart_items.filter(
            (item) => item.medicine.id !== cartItemId
          );
          const updatedTotals = recalculateTotals(updatedCartItems);
          return {
            ...prevCart,
            cart_items: updatedCartItems,
            ...updatedTotals,
          };
        });
      } else {
        toast.error("Failed to remove item from cart");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // check promo availability
  const checkPromo = async () => {
    try {
      const response = await axiosConfig.get("/coupons");
      if (response.status == 200) {
        setPromoAvailable(response.data.data);
      } else {
        toast.error("Failed to check promo availability");
      }
    } catch (error) {
      toast.error("Error checking promo availability", error);
    }
  };

  // Fetch updated addresses after closing the form
  const fetchUpdatedAddresses = async () => {
    try {
      const response = await axiosConfig.get("/addresses");
      if (response.status === 200) {
        setAddresses(response.data.data);
        setSelectedAddress(response.data.data[0]); // Set the first address again, or modify as needed
      }
    } catch (error) {
      console.error("Error fetching updated addresses", error);
    }
  };

  //get address
  const getAddress = async () => {
    try {
      const response = await axiosConfig.get("/addresses");
      if (response.status == 200) {
        setAddresses(response.data.data);
        setSelectedAddress(response.data.data[0]);
      } else {
        toast.error("Failed to get address");
      }
    } catch (error) {
      toast.error("Error getting address", error);
    }
  };

  const handleAddressChangeClick = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressClose = () => {
    setIsAddressModalOpen(false);
  };

  const toggleForm = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsFormVisible(!isFormVisible);
  };

  const shopPage = () => {
    navigate("/pharmacy");
  };

  const [paymentOption, setPaymentOption] = useState("cod"); // Default to "Cash on Delivery"

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPaymentOption(e.target.value);
  };

  const handlePayNow = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }
    setLoading(true);
    const orderData = {
      order: {
        address_id: selectedAddress.id,
        payment_type:
          paymentOption === "cod" ? "cash on delivery" : "paid Online",
        order_type: "Web app",
      },
    };

    try {
      const response = await axiosConfig.post("/orders", orderData);
      setErrorMessage(""); // Clear previous error messages

      if (response.data.data.razorpay_order_id) {
        const order_id = response.data.data.razorpay_order_id; // Example order ID
        const amount = cart.total; // Example amount in paise (e.g., 500.00 INR)
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
      } else {
        setLoading(false);
        alert("Order placed successfully!");

        navigate("/success", { state: { order: response.data.data } });
      }
      // Handle successful response (e.g., redirect to order confirmation page)
    } catch (error) {
      setLoading(false);
      console.error("Error placing order:", error);
      if (error.response && error.response.data && error.response.data.status) {
        // Set the error message from the response
        alert(error.response.data.status.message);

        setErrorMessage(error.response.data.status.message);
      } else {
        // Fallback error message
        setErrorMessage("Failed to place order. Please try again.");
      }
    }
  };

  // Razorpay payment function
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
      description: "Order Payment Description", // Replace with your transaction description
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
            "/payment_details/capture_order_payment",
            paymentDetails
          );

          // Check if the capture was successful
          console.log(captureResponse.data);
          if (captureResponse.data.status.code === 200) {
            alert(captureResponse.data.status.message); // Show the success message from the response

            // Navigate to the success page with the order data
            navigate("/success", {
              state: { order: captureResponse.data.data },
            });
          } else {
            alert(
              "Payment was successful, but capturing the payment details failed. Please contact support."
            );
            navigate("/error", {
              state: { order: captureResponse.data.data },
            });
          }
        } catch (error) {
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

  // Razorpay payment function

  const handlePromoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    ); // Show loader overlay
  }

  const handlePrescriptionUpload = (event) => {
    const file = event.target.files[0];
    setPrescriptionFile(file); // Set the uploaded file to state
  };

  const handleUploadPrescription = async () => {
    if (!prescriptionFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("prescriptions[]", prescriptionFile);

    try {
      const response = await axiosConfig.post(
        "/carts/upload_prescription",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type header
          },
        }
      );

      if (response.status === 200) {
        setCart(response.data.data);

        alert("Prescription uploaded successfully.");
        // Optionally, refresh the cart or perform some other action
        setPrescriptionFile(null); // Clear the file input after successful upload
      } else {
        alert("Failed to upload prescription.");
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
      alert("Error uploading prescription. Please try again.");
    }
  };

  const handleAddAddressClick = () => {
    // Logic to open an address form or modal
    setIsFormVisible(true); // If you have a state managing address form visibility
  };
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
                <a href="#">Medicine</a>
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
      <div className="cart-page">
        <div className="container">
          {/* check if cart have no data in that case show no item in cart message */}
          {cart && cart.cart_items.length === 0 ? (
            <div className="row">
              <div className="cart-products">
                <div className="label-cart d-flex flex-column p-4">
                  <div className="col-lg-12 mt-5 mb-5">
                    <div className="no-item-in-cart d-flex justify-content-center align-items-center">
                      <div className="item-cart text-center">
                        <div className="align-items-center text-center">
                          <h3 className="text-center">0 item found in cart</h3>
                        </div>
                        <button
                          className="buttonCustom m-0  align-items-center cart-add mb-87"
                          onClick={shopPage}
                        >
                          Shop Medicines
                          <img src="/img/add-items.svg" alt="" />
                        </button>

                        <div className="shipping">
                          <p>
                            <img src="/img/shipping-truck.png" alt="" />
                            Unlimited Free Shipping
                          </p>
                          <span>
                            <img src="/img/flower.svg" alt="" />
                            Niramaya Soul FIRST customers get extra ₹65.87
                            cashback on this order
                            <img src="/img/flower.svg" alt="" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="row">
                <div className="col-lg-8">
                  <div className="label-cart d-flex justify-content-between align-items-center">
                    {selectedAddress ? (
                      <>
                        <span>
                          {selectedAddress.name},{" "}
                          {selectedAddress.address_line1},{" "}
                          {selectedAddress.city_state},{" "}
                          {selectedAddress.pin_code}, {selectedAddress.landmark}
                          , {selectedAddress.phone_number}
                        </span>
                        <a
                          id="toggleBtn"
                          className="d-flex align-items-center gap-2"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent page refresh
                            handleAddressChangeClick(); // Trigger the address change function
                          }}
                        >
                          Edit Address{" "}
                          <img src="/img/edit.svg" alt="Edit Address" />
                        </a>
                      </>
                    ) : (
                      // If no address is selected, show prompt to add an address
                      <span>
                        Please provide your address to confirm delivery of the
                        item.
                      </span>
                    )}

                    {/* Add Address link */}
                    {!selectedAddress && (
                      <a
                        id="toggleBtn"
                        className="d-flex align-items-center gap-2"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent page refresh
                          handleAddAddressClick(); // Call the address adding function
                        }}
                      >
                        Add Address{" "}
                        <img src="/img/addaddress.svg" alt="Add Address" />
                      </a>
                    )}
                  </div>

                  <div className="cart-products">
                    <div className="item-cart">
                      <div className="cart-txt d-flex align-items-center gap-3">
                        <span>Items In Your Cart</span>
                        <label className="badge-cart">
                          {cart.cart_items.length}
                        </label>
                      </div>

                      {cart.cart_items.map((item) => (
                        <div
                          className="cart-items d-lg-flex justify-content-between align-items-stretch position-relative"
                          key={item.id}
                        >
                          <div className="d-sm-flex align-items-center gap75">
                            <div className="cart-pitcher">
                              <img
                                className="img-fluid"
                                src={item.medicine.images[0]}
                                alt={item.medicine.name}
                              />
                            </div>
                            <div className="cart-content">
                              <h3>
                                {" "}
                                <Link
                                  to={`/pharmacy/product/${toSlug(
                                    item.medicine.name
                                  )}`}
                                  state={{ piD: item.medicine.id }}
                                  style={{
                                    textDecoration: "none",
                                    color: "green",
                                  }}
                                >
                                  {item.medicine.name}
                                </Link>
                              </h3>
                              <span className="category">
                                {item.medicine.company_name}
                              </span>
                              <div className="price-d m-0 price-s">
                                <p className="d-inline-block p-0 price-main m-0 price-cart">
                                  <span>₹</span>
                                  {item.medicine?.new_price || item.medicine?.approx_mrp}
                                </p>

                                <p className="d-inline-block p-0 m-0 price-del-size">
                                  <span className="price-color">MRP </span>
                                  {item.medicine?.new_price && (
                                    <span className="price-del">
                                      ₹{item.medicine?.approx_mrp}
                                    </span>
                                  )}
                                </p>

                                {item.medicine?.item_discount && (
                                  <span className="save">
                                    Save {item.medicine?.item_discount}%
                                  </span>
                                )}

                                {/* <p className="d-inline-block p-0 price-main m-0 price-cart">
                                  <span>₹</span>
                                  {item.medicine.approx_mrp * item.quantity}
                                </p>
                                <p className="d-inline-block p-0 m-0 price-del-size">
                                  <span className="price-color">MRP</span>{" "}
                                  <span className="price-del">
                                    ₹{item.medicine.approx_mrp}
                                  </span>
                                </p> */}
                                {/* <span className="save">Save {Math.round(((item.medicine.mrp - item.medicine.price) / item.medicine.mrp) * 100)}%</span> */}
                              </div>
                              <span className="delevery-date">
                                Delivery {item.medicine.deliver_by}
                              </span>
                            </div>
                          </div>

                          <div className="cart-action d-flex flex-column align-items-end justify-content-between mh-100">
                            <a
                              href="#"
                              onClick={() => removeFromCart(item.medicine.id)}
                            >
                              <img src="/img/closec-cart.svg" alt="" />
                            </a>
                            <div className="position-relative flex-sm">
                              <div className="d-flex align-items-center">
                                <button
                                  className="btn btn-outline-secondary me-2"
                                  onClick={() => handleDecreaseClick(item)}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span>Qty: {item.quantity}</span>
                                <button
                                  className="btn btn-outline-secondary ms-2"
                                  onClick={() => handleIncreaseClick(item)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Link
                        className="applyfor m-0 cart-add mb-87"
                        to="/pharmacy"
                      >
                        Add More Items
                        <img src="/img/add-items.svg" alt="" />
                      </Link>
                      <div className="shipping">
                        <p>
                          <img src="/img/shipping-truck.png" alt="" />
                          Unlimited Free Shipping
                        </p>
                        <span>
                          <img src="/img/flower.svg" alt="" />
                          Niramaya Soul FIRST customers get extra ₹65.87
                          cashback on this order
                          <img src="/img/flower.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="book-consultation mb-4">
                    <h2 className="m-0 bookbtn">Upload Prescription</h2>
                    {checkPrescriptionRequired() && (
                      <div className="upload-prescription d-grid gap-3 mt-3">
                        <input
                          type="file"
                          accept="image/*" // Adjust based on allowed file types
                          onChange={(e) =>
                            setPrescriptionFile(e.target.files[0])
                          }
                          className="form-control-file"
                          id="prescriptionInput"
                          style={{ gridColumn: "1 / -1", width: "100%" }} // Occupy the full width
                        />
                        <button
                          onClick={handleUploadPrescription}
                          className="badd-btn buttonCustomAdd w-100"
                          disabled={!prescriptionFile} // Disable button if no file is selected
                          style={{ gridColumn: "1 / -1", width: "100%" }} // Occupy the full width
                        >
                          Upload
                        </button>
                      </div>
                    )}
                    {!checkPrescriptionRequired() && (
                      <p className="text-muted mt-2">
                        No prescription required for the items in your cart.
                      </p>
                    )}
                  </div>

                  {promoCode?.length > 0 ? (
                    <div
                      className="book-consultation"
                      onClick={handlePromoClick}
                    >
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
                    promoType={"cart"}
                    bookingID={cart.id}
                    fetchBookings={fetchCartData}
                  />

                  <div className="timeslots mb-4">
                    <h2 className="m-0 bookbtn">Total Charges</h2>
                    <div className="d-flex justify-content-between flex-column w-100">
                      <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                        <li>MRP Total</li>
                        <li>
                          <span>₹{cart?.total_mrp || "0.00"}</span>
                        </li>
                      </ul>
                      <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                        <li>Items Discount</li>
                        <li>
                          <span>₹{cart?.items_discount || "0.00"}</span>
                        </li>
                      </ul>
                      <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                        <li>Coupon Discount</li>
                        <li>
                          <span>₹{cart?.coupon_discount || "0.00"}</span>
                        </li>
                      </ul>
                      <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                        <li>Shipping / Delivery Charges</li>
                        <li>
                          <span>
                            {cart.cart?.delivery_charges
                              ? `₹${cart.delivery_charges}`
                              : "Free"}
                          </span>
                        </li>
                      </ul>
                      <div className="border-bottom w-100 mb-25"></div>
                      <ul className="list-unstyled d-flex justify-content-between w-100 totalpay">
                        <li>Total Pay</li>
                        <li>
                          <span>₹{cart?.total || "0.00"}</span>
                        </li>
                      </ul>
                      <ul className="list-unstyled d-flex justify-content-between w-100 totalpay bgpay">
                        <li>Total Savings</li>
                        <li>
                          <span>₹{cart?.total_savings || "0.00"}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="paymnt-option">
                      <span>
                        <img src="img/case.png" alt="" />
                        Select Payment Option
                      </span>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentOption"
                          id="flexRadioDefault1"
                          value="cod"
                          checked={paymentOption === "cod"}
                          onChange={handlePaymentChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault1"
                        >
                          Cash on Delivery(COD)
                        </label>
                      </div>

                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentOption"
                          id="flexRadioDefault2"
                          value="prepaid"
                          checked={paymentOption === "prepaid"}
                          onChange={handlePaymentChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault2"
                        >
                          Prepaid
                        </label>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center gap-3">
                      <div className="d-flex flex-column totalpayble">
                        <span>Total payable</span>
                        <p className="m-0">₹{cart?.total || "0.00"}</p>
                      </div>
                      <button
                        className="applyfor m-0 border-0"
                        onClick={handlePayNow}
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <AddressModel
        isOpen={isAddressModalOpen}
        onClose={handleAddressClose}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress} // Pass setSelectedAddress function to the child
      />{" "}
      {isFormVisible && (
        <AddressForm
          action={isFormVisible}
          onClose={() => {
            setIsFormVisible(false);
            fetchUpdatedAddresses(); // Fetch updated addresses after closing the form
          }}
        />
      )}
    </Layout>
  );
}

export default Cart;
