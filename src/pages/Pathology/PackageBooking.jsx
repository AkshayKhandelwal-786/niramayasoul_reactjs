import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosToken";
//import axiosToken from "../../services/axiosToken";

import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import PromoModel from "../Cart/PromoModel";
import AddressModel from "../../components/AddressModel";
import dayjs from "dayjs";
import AddressForm from "../Cart/AddressForm";

const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
function PackageBooking() {
  const [loading, setLoading] = useState(true); // For loading state
  const location = useLocation();
  const { packageId } = location.state || {}; // Access the passed packageId

  const navigate = useNavigate(); // For navigation
  const { packagename } = useParams();

  const [labLists, setLabLists] = useState([]); // For labTests
  const [packageDetails, setPackageDetails] = useState({});
  const [labID, setLabID] = useState("");
  const [promo, setPromo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null); // For single lab details
  const [popularPackages, setPopularPackages] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // Track selected address
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // For address popup
  const [members, setMembers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Fetch all necessary data when component mounts
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data concurrently using Promise.all
        const [
          labsRes,
          packageRes,
          popularRes,
          promoRes,
          memberRes,
          addressRes,
        ] = await Promise.all([
          axiosConfig.get("/labs"),
          axiosConfig.get(`/packages/${packageId}`),
          axiosConfig.get("/packages/popular_packages"),
          axiosConfig.get("/coupons"),
          axiosConfig.get(`/members/${localStorage.getItem("selectedMember")}`),
          axiosConfig.get("/addresses"),
        ]);

        setLabLists(labsRes.data.data);
        setPackageDetails(packageRes.data.data);
        setLabID(packageRes.data.data.lab_id);
        setPopularPackages(popularRes.data.data);
        setPromo(promoRes.data.data);
        setMembers(memberRes.data.data);
        setAddresses(addressRes.data.data);
        if (addressRes.data.data.length > 0) {
          setSelectedAddress(addressRes.data.data[0]); // Set default address as selected
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); // Set loading to false after all API calls are done
      }
    };

    fetchData();
  }, [packageId]);

  useEffect(() => {
    // Find the lab with the matching labID
    if (labLists.length > 0 && labID) {
      const lab = labLists.find((lab) => lab.id == labID); // Adjust 'id' as per your actual key
      setSelectedLab(lab);
    }
  }, [labLists, labID]); // Depend on labLists and labID

  const handleAddressChangeClick = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressClose = () => {
    setIsAddressModalOpen(false);
  };

  const handleProceedClick = async () => {
    let appoinType =
      localStorage.getItem("appointmentType") === "Visit Lab"
        ? "visit lab"
        : "home collect sample";

    // Define the parameters for the booking
    const bookingData = {
      booking: {
        package_id: packageId,
        time_slot: localStorage.getItem("bookingSlot"),
        date_slot: localStorage.getItem("bookingDate"),
        appointment_type: appoinType,
        payment_type: "paid_online",
        platform_fee: 80.0,
      },
      address_id: localStorage.getItem("selectedAddress"),
      lab_id: labID,
      member_id: localStorage.getItem("selectedMember"),
    };

    try {
      // Make the API request to book the package
      const response = await axiosConfig.post("/book_package", bookingData);

      // Handle the successful response
      if (response.data.status.code === 201) {
        localStorage.setItem("packageBookId", response.data.data.id);
        // navigate(`/pathology/packages/confirmBook/${packagename}/${packageId}`);
        navigate(`/pathology/packages/confirmBook/${packagename}`, {
          state: { packageId: packageId },
        });
      } else {
        console.error("Booking failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error booking package:", error);
    }
  };

  const handleAddAddressClick = () => {
    // Logic to open an address form or modal
    setIsFormVisible(true); // If you have a state managing address form visibility
  };

  const toggleForm = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsFormVisible(!isFormVisible);
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
            {localStorage.getItem("appointmentType") === "Home Sample" ? ( <>
              <div className="label-cart d-flex justify-content-between align-items-center">
                {selectedAddress ? (
                  <>
                    <span>
                      {selectedAddress.name}, {selectedAddress.address_line1} {" "}
                      {selectedAddress.city_state}  {selectedAddress.pin_code} {" "}
                      {selectedAddress.landmark}  {selectedAddress.phone_number}
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
              {packageDetails && packageDetails.lab && selectedLab ? (
                <div className="book-consultation">
                  <h2 className="m-0 bookbtn">Selected Lab</h2>
                  <div className="d-flex justify-content-between align-items-center list-page mb-0">
                    <div className="d-flex gap13">
                      {packageDetails.lab.image_url ? (
                        <img
                          src={packageDetails.lab.image_url}
                          alt={packageDetails.lab.name || "Lab Image"}
                          className="img-fluid w-25"
                        />
                      ) : (
                        <img
                          src="/img/default-lab.png"
                          alt="Default Lab"
                          className="img-fluid w-25"
                        />
                      )}

                      <div className="cupon-content">
                        <p className="m-0">{packageDetails.lab.name}</p>
                        {selectedLab.addresses &&
                        selectedLab.addresses.length > 0 ? (
                          <span>
                            {selectedLab.addresses[0].name
                              ? selectedLab.addresses[0].name + ", "
                              : ""}
                            {selectedLab.addresses[0].address_line1
                              ? selectedLab.addresses[0].address_line1 + ", "
                              : ""}
                            {selectedLab.addresses[0].pin_code
                              ? selectedLab.addresses[0].pin_code + ", "
                              : ""}
                            {selectedLab.addresses[0].city_state
                              ? selectedLab.addresses[0].city_state
                              : ""}
                          </span>
                        ) : (
                          <span>No address available</span>
                        )}
                      </div>
                    </div>
                    <img src="/img/arrowgreen.svg" alt="Arrow" />
                  </div>
                </div>
              ) : null}

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
                      <span>₹ {packageDetails.selling_price}</span>
                    </li>
                  </ul>
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                    <li>Platform Fee</li>
                    <li>
                      <span>₹ 80.00</span>
                    </li>
                  </ul>
                  {/* {coupon_discount > 0 && (
                    <ul className="list-unstyled d-flex justify-content-between w-100 totalcharege mb-0">
                      <li>Coupon Discount</li>
                      <li>
                        <span>- ₹{coupon_discount}</span>
                      </li>
                    </ul>
                  )} */}
                  <div className="border-bottom w-100 mb-25"></div>
                  <ul className="list-unstyled d-flex justify-content-between w-100 totalpay">
                    <li>Total Pay</li>
                    <li>
                      <span>₹ {Number(packageDetails.selling_price) + 80}</span>
                    </li>
                  </ul>
                </div>

                <div className="border-bottom w-100 mb-25"></div>

                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div className="d-flex flex-column totalpayble">
                    <span>Total payable</span>
                    <p className="m-0">
                      ₹{" "}
                      <span>₹ {Number(packageDetails.selling_price) + 80}</span>
                    </p>
                  </div>
                  <button className="applyfor m-0" onClick={handleProceedClick}>
                    Proceed
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between align-items-center mb319">
                <h3 className="ptest">Popular Tests</h3>
                {/* <a className="btn-more btn-load-more" href="#">
                  View All
                </a> */}
              </div>
            </div>
          </div>
          <div className="row g-4">
            {popularPackages.slice(0, 12).map((packageData) => (
              <div key={packageData.id} className="col-lg-4 d-flex">
                <div className="test-main w-100">
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
                      <span>Top Deal</span>
                      <div className="price-amount">
                        <p className="mb-0">
                          {/* Assuming you have calculated the selling price and discount dynamically */}
                          <span className="pricefix">₹{packageData.mrp}</span>
                          {packageData.actual_price && (
                            <span className="price-delete">
                              <del>(₹{packageData.actual_price})</del>
                            </span>
                          )}
                          {/* Assuming discount calculation */}
                          {packageData.selling_price && (
                            <span className="off">
                              {" "}
                              ₹{packageData.selling_price} (
                              {packageData.discount}% off)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Link
                      className="add-btn"
                      to={`/pathology/packages/details/${toSlug(
                        packageData.name
                      )}`}
                      state={{ packageId: packageData.id }}
                    >
                      View details
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

export default PackageBooking;
