import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosConfig from "../../services/axiosToken"; // Assuming axiosConfig is already set up
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";

function MyMedOrdersDetails() {
  const { state } = useLocation();
  const { order } = state;
  const [orderStatus, setOrderStatus] = useState(order.order_status); // State for order status
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "badge-completed";
      case "pending":
        return "badge-ongoing";
        case "cancelled":
          return "badge-cancelled";
      default:
        return "";
    }
  };

  const cancelOrder = async () => {
    try {
      // Show some confirmation before cancelling
      const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
      if (!confirmCancel) return;

      // API call to cancel the order
      const response = await axiosConfig.put(`/orders/${order.id}/cancel_order`);
      if (response.status === 200) {
        // Update order status in the local state
        setOrderStatus("cancelled");
        alert("Order has been cancelled successfully");
        navigate("/dashboard/medicines-orders"); // Redirect to orders list page after cancelling
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel the order. Please try again.");
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
                <a href="#">Medicine Orders</a>
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
                <div className="personal-info mb-4 d-flex justify-content-between align-items-center">
                  <h3>Medicine Orders</h3>
                  <span className={`status-badge ${getStatusClass(orderStatus)}`}>
                    {orderStatus.toUpperCase()}
                  </span>
                </div>
                <span>{order.cart.cart_items.length} Items in this order</span>

                <div className="row mt-4">
                  <div className="col-lg-7">
                    {/* Order Items */}
                    {order.cart.cart_items.map((item) => (
                      <div key={item.id} className="media mb-4 border-bottom pb-3">
                        <img
                          src={item.medicine.images[0]}
                          alt={item.medicine.name}
                          className="mr-3"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <div className="media-body">
                          <h5 className="mt-0">{item.medicine.name}</h5>
                          <p>Brand Name: {item.medicine.brand.name}</p>
                          <h6 className="text-success">&#8377;{item.medicine.new_price || item.medicine.old_price}</h6>
                          {/* <button className="btn btn-light btn-sm">Cancel Item</button> */}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="col-lg-5">
                    {/* Billing Details */}
                    <div className="card mb-4 shadow-sm">
                      <div className="card-body">
                        <h4 className="card-title">Billing Details</h4>
                        <p>
                          MRP Total: <strong>&#8377;{order.cart.total_mrp}</strong>
                        </p>
                        <p>
                          Item Discount:{" "}
                          <strong className="text-success">
                            -&#8377;{order.cart.items_discount}
                          </strong>
                        </p>
                        <p>
                          Coupon Discount:{" "}
                          <strong className="text-success">
                            -&#8377;{order.cart.coupon_discount}
                          </strong>
                        </p>
                        <p>
                          Shipping/Delivery Charges: <strong>Free</strong>
                        </p>
                        <hr />
                        <h5>
                          Total Pay: <strong>&#8377;{order.cart.total}</strong>
                        </h5>
                        <p className="text-success">
                          Total Savings: &#8377;{order.cart.total_savings}
                        </p>
                      </div>
                    </div>

                    {/* Order Status */}
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h4 className="card-title">Order Status</h4>
                        <p>
                          <strong>Order Id:</strong> #{order.id}
                        </p>
                        <p>
                          <strong>Payment:</strong> {order.payment_type}
                        </p>
                        <p>
                          <strong>Deliver To:</strong> {order.address}
                        </p>
                        <p>
                          <strong>Order Date:</strong>{" "}
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                        <div className="d-flex justify-content-between">
                          <button className="btn btn-success">Track Order</button>
                          <button className="btn btn-danger" onClick={cancelOrder}>
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyMedOrdersDetails;
