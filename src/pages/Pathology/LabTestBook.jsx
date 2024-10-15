import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosToken";
import { useNavigate } from "react-router-dom";
import AddressModel from "../../components/AddressModel";
import AddressForm from "../Cart/AddressForm";

function LabTestBook() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [labLists, setLabLists] = useState([]);
  const [labID, setLabID] = useState("");
  const [selectedLab, setSelectedLab] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [cart, setCart] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [labsRes, memberRes, addressRes] = await Promise.all([
          axiosConfig.get("/labs"),
          axiosConfig.get(`/members/${localStorage.getItem("selectedMember")}`),
          axiosConfig.get("/addresses"),
        ]);

        setLabLists(labsRes.data.data);
        setMembers(memberRes.data.data);
        setAddresses(addressRes.data.data);
        if (addressRes.data.data.length > 0) {
          setSelectedAddress(addressRes.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedLabID = localStorage.getItem("selectedLab");
    setLabID(storedLabID || "");
  }, []);

  useEffect(() => {
    if (labID && labLists.length > 0) {
      const lab = labLists.find((lab) => lab.id.toString() === labID);
      setSelectedLab(lab || null);
    }
  }, [labID, labLists]);

  const handleAddressChangeClick = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressClose = () => {
    setIsAddressModalOpen(false);
  };

  useEffect(() => {
    const storedCartData = localStorage.getItem("cartData");
    const storedCart = localStorage.getItem("cart");

    if (storedCartData) {
      setCartData(JSON.parse(storedCartData));
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const totalMRP = cartData.reduce((sum, item) => {
    // Convert best_price to a number if it’s a string
    const price = parseFloat(item.best_price) || 0;
    return sum + price;
  }, 0);

  // Ensure totalMRP is formatted correctly for display
  const formattedTotalMRP = totalMRP.toFixed(2);
  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  console.log(selectedLab?.image_url);

  const handleProceedClick = async () => {
    let appoinType =
      localStorage.getItem("appointmentType") === "Visit Lab"
        ? "visit_lab"
        : "home_collect_sample";

    try {
      // Retrieve data from local storage
      const bookingSlot = localStorage.getItem("bookingSlot");
      const bookingDate = localStorage.getItem("bookingDate");
      const selectedMember = localStorage.getItem("selectedMember");
      const selectedAddress = localStorage.getItem("selectedAddress");

      // Ensure data is parsed correctly
      const cartData = JSON.parse(localStorage.getItem("cartData")) || [];

      // Construct the payload for the API request
      const requestBody = {
        lab_test_booking: {
          date_slot: bookingDate, // Ensure this is in the correct format
          appointment_type: appoinType, // You can adjust this based on your form input
          payment_type: "paid_online", // Adjust based on user selection
          platform_fee: 80,
          lab_id: labID, // Adjust based on selected lab
          lab_tests: cartData.map((test) => ({
            lab_test_id: test.id.toString(), // Convert to string if needed
            time: bookingSlot, // Ensure this matches your requirement
          })),
        },
        member_id: parseInt(selectedMember, 10),
        address_id: parseInt(selectedAddress, 10),
      };

      // Make the API call
      const response = await axiosConfig.post(
        "/lab_test_bookings",
        requestBody
      );
      console.log("Booking successful:", response.data);
      if (response.data.status.code === 200) {
        //alert(response.data.status.message);
        localStorage.setItem("labBookId", response.data.data.id);
        navigate(`/pathology/lab-test/confirmBook`);
      } else {
        alert(response.data.message);
        console.error("Booking failed:", response.data.message);
      }
      // Navigate or show success message
      //navigate("/lab-test-cart"); // Redirect to a different page or show a success message
    } catch (error) {
      alert("An error occurred while booking the lab test. Please try again.");
      console.error("Error booking lab test:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  const toggleForm = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsFormVisible(!isFormVisible);
  };

  const handleAddAddressClick = () => {
    // Logic to open an address form or modal
    setIsFormVisible(true); // If you have a state managing address form visibility
  };

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
                <a href="#">Lab Test</a>
              </li>
              <li>/</li>
              <li
                className="breadcrumb-item active-bradcurmb"
                aria-current="page"
              >
                <a href="#">Booking</a>
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
                {selectedAddress ? (
                  <>
                    <span>
                      {selectedAddress.name}, {selectedAddress.address_line1},{" "}
                      {selectedAddress.city_state}, {selectedAddress.pin_code},{" "}
                      {selectedAddress.landmark}, {selectedAddress.phone_number}
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
                    Please provide your address to confirm delivery of the item.
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
                </div>
              ))}
            </div>
            <div className="col-lg-4">
              <div className="book-consultation">
                <h2 className="m-0 bookbtn">Selected Lab</h2>
                <div className="d-flex justify-content-between align-items-center list-page mb-0">
                  <div className="d-flex gap13">
                    <img
                      src={selectedLab?.image_url}
                      alt={selectedLab?.name}
                      className="img-fluid w-25"
                    />
                    <div className="cupon-content">
                      <p className="m-0">{selectedLab?.name}</p>
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

              <div className="timeslots">
                <h2 className="m-0 bookbtn">Total Charges</h2>
                <div className="d-flex justify-content-between flex-column w-100">
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                    <li>Labtest Fee</li>
                    <li>
                      <span>₹ {formattedTotalMRP}</span>
                    </li>
                  </ul>
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                    <li>Platform Fee</li>
                    <li>
                      <span>₹ 80.00</span>
                    </li>
                  </ul>
                  <div className="border-bottom w-100 mb-25"></div>
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalpay">
                    <li>Total Pay</li>
                    <li>
                      <span>
                        ₹ {(parseFloat(formattedTotalMRP) + 80).toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-bottom w-100 mb-25"></div>

                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div className="d-flex flex-column totalpayble">
                    <span>Total payable</span>
                    <p className="m-0">
                      ₹ {(parseFloat(formattedTotalMRP) + 80).toFixed(2)}
                    </p>
                  </div>
                  <button className="applyfor m-0" onClick={handleProceedClick}>
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAddressModalOpen && (
        <AddressModel
          isOpen={isAddressModalOpen}
          onClose={handleAddressClose}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress} // Pass setSelectedAddress function to the child
        />
      )}
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

export default LabTestBook;
