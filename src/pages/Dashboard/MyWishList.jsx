import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";
import axiosConfig from "../../services/axiosToken";
import { Link } from "react-router-dom";

function MyWishList() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    // Fetch the wishlist data from the API
    const fetchWishlist = async () => {
      try {
        const response = await axiosConfig.get("/wishlists"); // Replace with actual API URL
        setWishlistItems(response.data.data.items); // Set the items from the response
      } catch (error) {
        console.error("Error fetching wishlist", error);
      }
    };

    fetchWishlist();
  }, []);

  // Function to remove an item from the wishlist
  const handleRemoveFromWishlist = async (medicine_id) => {
    try {
      await axiosConfig.delete("/wishlists/remove_item_from_wishlist", {
        data: { medicine_id }, // DELETE request body for the API
      });

      // Update the wishlist locally after successful deletion
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== medicine_id)
      );
    } catch (error) {
      console.error("Error removing item from wishlist", error);
    }
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
                <a href="#">Dashboard</a>
              </li>
              <li>/</li>
              <li className="breadcrumb-item">
                <a href="#">My Wishlist</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      <section className="py-dashboard">
        <div className="container">
          <div className="row">
            <Sidebar />
            <div className="col-lg-9">
              <DashboardSubHeader />
              <div className="p-info">
                <div className="personal-info mb-4">
                  <h3>My Wishlist</h3>
                  <span>Below are the lists</span>
                </div>

                {/* Wishlist Items */}
                <div className="card-list">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                      <div className="card mb-3" key={item.id}>
                        <div className="row g-0 align-items-center">
                          <div className="col-md-2">
                            <img
                              src={item.images[0]} // Use the first image
                              alt={item.name}
                              className="img-fluid"
                            />
                          </div>
                          <div className="col-md-7">
                            <div className="card-body">
                              <h5 className="card-title">{item.name}</h5>
                              <p className="card-text">
                                <strong>₹{item.approx_mrp}</strong> MRP{" "}
                                <span>₹{item.old_price || "0.00"}</span>
                              </p>
                              <p className="card-text">{item.company_name}</p>
                            </div>
                          </div>
                          <div className="col-md-3 d-flex flex-column align-items-end mr-3">
                            <button
                              className="btn btn-outline-secondary btn-danger w-100 mb-2"
                              onClick={() => handleRemoveFromWishlist(item.id)} // Remove item from wishlist
                            >
                              Remove
                            </button>

                            <Link
                              to={`/pharmacy/product/${item.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}/${item.id}`}
                              className="btn btn-success w-100"
                            >
                              Add to Cart
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No items in the wishlist</p>
                  )}
                </div>
                {/* End of wishlist list */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyWishList;
