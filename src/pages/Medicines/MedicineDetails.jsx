import React, { useEffect, useState, lazy, Suspense } from "react";
import Layout from "../../components/Layout";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axiosConfig from "../../services/axiosConfig";
import axiosToken from "../../services/axiosToken";
const ProductSlider = lazy(() => import("../../components/ProductSlider"));
import { toast, Toaster } from "react-hot-toast";

const truncateDescription = (description) => {
  if (!description) return "";

  const words = description.split(" ");
  if (words.length <= 100) return description; // If it's already within the limit

  return words.slice(0, 20).join(" ") + "..."; // Truncate to 200 words and add ellipsis
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

function MedicineDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pDetails, setPDetails] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [addCartLoading, setCartLoading] = useState(false);
  const [checkPincode, setCheckPincode] = useState(true);

  const { piD: statepid } = location.state || {};
  const piD = statepid || localStorage.getItem("piD");

  const [isItemInCart, setIsItemInCart] = useState(false); // Track if the item is in the cart

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.includes(piD); // Check if this item is in the cart
    setIsItemInCart(isAlreadyInCart);
  }, [piD]);

  useEffect(() => {
    if (piD) {
      getProductDetails();
      getSimilarProducts();
    } else {
      console.error("Product ID is missing");
      navigate("/404"); // Redirect to 404 if no product ID is found
    }
  }, [piD]);

  const getProductDetails = async () => {
    try {
      const response = await axiosConfig.get(`/medicines/${piD}`);
      setPDetails(response.data.data || {});
    } catch (error) {
      console.error(error);
      setPDetails(null); // Set to null on error
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  const getSimilarProducts = async () => {
    try {
      const response = await axiosConfig.get(
        `/medicines/${piD}/similar_products`
      );
      setSimilarProducts(response.data.data || []);
    } catch (error) {
      console.error(error);
      setSimilarProducts([]); // Set to empty array on error
    }
  };

  const [pincode, setPincode] = useState("");
  const [availability, setAvailability] = useState(null);
  const [isServiceable, setIsServiceable] = useState(false);

  useEffect(() => {
    const savedPincode = localStorage.getItem("serviceablePincode");
    if (savedPincode) {
      setPincode(savedPincode);
      handleCheckPincode(savedPincode); // Check serviceability for saved pincode
    }
  }, []);

  const handleCheckPincode = async (pincodeToCheck) => {
    if (pincodeToCheck.length === 6) {
      try {
        const response = await axiosConfig.get(
          "/pincodes/check_pincode_availability",
          {
            params: { pincode: { code: pincodeToCheck } },
          }
        );

        setAvailability(response.data); // Store the API response

        if (response.data.status && response.data.status.code === 200) {
          setIsServiceable(true);
          setCheckPincode(false);
          localStorage.setItem("serviceablePincode", pincodeToCheck); // Store pincode in localStorage
        } else {
          setIsServiceable(false);
          setCheckPincode(true);
          localStorage.removeItem("serviceablePincode"); // Remove if not serviceable
        }
      } catch (error) {
        console.error("Error checking pincode availability:", error);
        setAvailability({
          status: { code: 422, message: "This pincode is not serviceable" },
        });
        setIsServiceable(false);
        setCheckPincode(true);
        localStorage.removeItem("serviceablePincode"); // Remove if there was an error
      }
    } else {
      setIsServiceable(false);
      setAvailability(null);
      setCheckPincode(true);
      localStorage.removeItem("serviceablePincode"); // Remove if pincode length is invalid
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setPincode(value);
    if (value.length === 6) {
      handleCheckPincode(value); // Check serviceability when a valid pincode is entered
    } else {
      setAvailability(null);
      setIsServiceable(false);
    }
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userid");
    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    if (!pincode) {
      console.log('Pincode entered:', pincode);
      toast.error("The pincode field is required.");
      return;
    }
    if(pincode.length < 6) {
      toast.error("The pincode field must be 6 digit.");
      return;
    }    
    if(checkPincode) {
      return;
    }
    setCartLoading(true); // Set loading state to true
    const payload = { medicine_id: piD, quantity: 1 };
    try {
      await axiosToken.post("/carts/add_to_cart", payload);
      toast.success("Item added to cart.");
      setIsItemInCart(true); // Update the state to reflect that the item is in the cart
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setCartLoading(false); // Reset loading state
    }
  };

  const handleBuyNow = async () => {
    const userId = localStorage.getItem("userid");
    if (!userId) {
      toast.error("Please log in to purchase items.");
      navigate("/login");
      return;
    }
    if (!pincode) {
      console.log('Pincode entered:', pincode);
      toast.error("The pincode field is required.");
      return;
    }
    if(pincode.length < 6) {
      toast.error("The pincode field must be 6 digit.");
      return;
    }    
    if(checkPincode) {
      return;
    }
    setCartLoading(true); // Set loading state to true
    const payload = {
      order: {
        order_medicines_attributes: [{ medicine_id: piD, quantity: 1 }],
      },
    };
    try {
      await axiosToken.post("/orders/buy_now", payload);
      toast.success("Item purchased successfully.");
      navigate("/cart");
    } catch (error) {
      console.error("Error purchasing item:", error);
      toast.error("Failed to purchase the item. Please try again.");
    } finally {
      setCartLoading(false); // Reset loading state
    }
  };

  const handleViewCart = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  const handleLogingRedirect = (redirectURL) => {
    localStorage.setItem("redirectURL", redirectURL);
    localStorage.setItem("piD", piD);
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
      <Toaster position="top-right" />
      <nav className="navbar navbar-expand-lg shadow-none bg-white detail-y">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb gap-2">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li>/</li>
              <li className="breadcrumb-item">
                <Link to="/pharmacy">Pharmacy</Link>
              </li>
              <li>/</li>
              <li
                className="breadcrumb-item active-bradcurmb"
                aria-current="page"
              >
                <span>{pDetails?.name || "Product"}</span>
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      <section className="pt-0">
        <div className="container">
          <div className="row mb-44">
            <div className="col-lg-6">
              <div className="product-slider mb-lg-0 mb-3">
                <Suspense fallback={<div>Loading...</div>}>
                  <ProductSlider
                    productDetails={{ images: pDetails?.images }}
                  />
                </Suspense>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="detail-summary">
                <article>
                  <span className="badge badge-primary bagde-pro">
                    {pDetails?.medicine_category?.name || "N/A"}
                  </span>

                  <div className="price-section">
                    <span className="title-price">
                      {pDetails?.name || "N/A"}
                    </span>
                    <div className="price-d">
                      <p className="d-inline-block p-0 price-main m-0">
                        <span>₹</span>
                        {pDetails?.new_price || pDetails?.approx_mrp}
                      </p>

                      {/* Show MRP with strikethrough if new_price exists */}
                      {pDetails?.new_price && (
                        <p className="d-inline-block p-0 price-del m-0">
                          <span>MRP</span> <del>₹{pDetails?.approx_mrp}</del>
                        </p>
                      )}

                      {/* Show discount if item_discount exists */}
                      {pDetails?.item_discount && (
                        <span className="save">
                          Save {pDetails.item_discount}
                        </span>
                      )}
                    </div>

                    <span className="texes-all">Inclusive of all taxes</span>
                  </div>
                  <div className="border-bottom border-b"></div>

                  <div className="list-details">
                    <ul>
                      <li>Manufacturer: {pDetails?.company_name || "N/A"}</li>
                      <li>Type of Sell: {pDetails?.type_of_sell || "N/A"}</li>
                      <li>
                        Prescription Required:{" "}
                        {pDetails?.prescription_required ? "Yes" : "No"}
                      </li>
                      <li>{truncateDescription(pDetails?.details) || "N/A"}</li>
                      <li>Deliver by: {pDetails?.deliver_by || "N/A"}</li>
                    </ul>
                  </div>

                  <div className="border-bottom border-b"></div>

                  <div className="pincode">
                    <div className="code-plan d-flex align-items-center">
                      <div className="check-code">
                        <input
                          type="text"
                          value={pincode}
                          placeholder="Enter Pincode"
                          onChange={handlePincodeChange}
                          maxLength={6}
                          pattern="\d{6}"
                          title="Enter a 6-digit pincode"
                        />
                        <img src="/img/map-marker.svg" alt="icon" />
                      </div>
                    </div>
                    {availability && (
                      <div
                        className={`availability-result ${
                          isServiceable ? "success mb-3" : "error"
                        }`}
                      >
                        {availability.status.message}
                      </div>
                    )}
                  </div>
                  {/* show meesage if !isServiceable  */}
                  {!isServiceable && (
                    <div className="availability-result text-primary error  mt-2 mb-3">
                      Please check your pincode for service availableity
                    </div>
                  )}
                  <div className="d-flex align-items-center dilivery-list">
                    <img src="/img/truck.svg" alt="" />
                    <ul className="list-unstyled d-flex gap-3 m-0">
                      <li>DELIVERY BY</li>
                      <li>|</li>
                      <li>{pDetails?.deliver_by || "N/A"}</li>
                    </ul>
                  </div>

                  <div className="cart-btn d-lg-flex gap-3 mb-4 flex-wrap">
                    {localStorage.getItem("userid") ? (
                      <>
                        <button
                          className="cart-btn-inner mb-lg-0 mb-2"
                          // disabled={!isServiceable || addCartLoading} // Disable until serviceable or while loading
                          onClick={
                            isItemInCart ? handleViewCart : handleAddToCart
                          } // Change action based on state
                        >
                          <img src="/img/cart-icon.svg" alt="cart-icon" />
                          {addCartLoading
                            ? "Add to Cart" // Show loading state
                            : isItemInCart
                            ? "View Cart" // Show "View Cart" if item has been added
                            : "Add to Cart"}{" "}
                          {/* Default to "Add to Cart" */}
                        </button>
                        <button
                          className="cart-btn-inner buynow"
                          onClick={handleBuyNow}
                          // disabled={!isServiceable} // Disable until serviceable
                        >
                          Buy Now
                        </button>
                      </>
                    ) : (
                      <button
                        className="buttonCustom cart-btn mb-0"
                        onClick={() =>
                          handleLogingRedirect(location.pathname.substring(1))
                        }
                      >
                        Login to Buy This Product
                      </button>
                      // <Link to="/login" className="cart-btn-inner">
                      //   Login to Buy This Product
                      // </Link>
                    )}
                  </div>

                  {/* Offers Section */}
                  <div className="offers">
                    <div className="row gy-lg-0 gy-3">
                      <div className="col-lg-6 d-flex">
                        <div className="offer-card d-flex align-items-center w-100">
                          <img src="/img/offer.svg" alt="offer" />
                          <div className="text-offer">
                            <h5>Hot Offers</h5>
                            <p className="m-0">
                              Discounts up to <span>90%</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 d-flex">
                        <div className="offer-card d-flex align-items-center w-100 bg-g">
                          <img src="/img/shipping.svg" alt="offer" />
                          <div className="text-offer">
                            <h5>Free Shipping</h5>
                            <p className="m-0">
                              Free delivery for orders from <span>Rs:</span>
                              <span>500</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="border-bottom mb-33"></div>
            </div>
            <div className="col-lg-12">
              <div className="disc-detail">
                <div className="details-d">
                  <h4>Explore More from {pDetails?.brand?.name || "N/A"}</h4>
                  <span>{pDetails?.details || "N/A"}</span>
                </div>
                <div className="list-details mb-0">
                  <ul className="ps-3">
                    <li>Manufacturer: {pDetails?.company_name || "N/A"}</li>
                    <li>Type of Sell: {pDetails?.type_of_sell || "N/A"}</li>
                    <li>
                      Prescription Required:{" "}
                      {pDetails?.prescription_required ? "Yes" : "No"}
                    </li>
                    <li>
                      This product cannot be returned for a refund or exchange.
                    </li>
                    <li>Expiry Date: {pDetails?.expiry_date || "N/A"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* check similarProducts length */}
      {similarProducts.length > 0 && (
        <section className="py-0">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mx-auto">
                <div className="heading text-left mb-4 position-relative d-flex justify-content-between align-items-center">
                  <h2 className="pb-0">Similar Products</h2>
                  {/* <a className="btn-more btn-load-more btn-viewall" href="#">
                    View All
                  </a> */}
                </div>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4 mb-70">
              {similarProducts.map((product) => (
                <div className="col" key={product.id}>
                  <div className="h-100 d-flex flex-column">
                    <Link
                      to={`/pharmacy/product/${toSlug(product.name)}`}
                      state={{ piD: product.id }}
                      className=""
                    >
                      <div className="prduct-card pharmacy-image">
                        <img
                          className="img-fluid w-100"
                          src={product.images[0] || "/img/default.png"}
                          alt={product.name || "Product Image"}
                        />
                      </div>
                    </Link>
                    <div className="product-dis flex-grow-1 d-flex flex-column">
                      <span>{product.brand?.name || "N/A"}</span>
                      <p>{product.name || "N/A"}</p>
                      <div className="price mt-auto">
                        <p>₹{parseFloat(product.approx_mrp || 0).toFixed(2)}</p>
                      </div>
                      <Link
                        className="cart-btn mt-auto"
                        to={`/pharmacy/product/${toSlug(product.name)}`}
                        state={{ piD: product.id }}
                      >
                        <img src="/img/btnc.svg" alt="Add to cart" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export default MedicineDetails;
