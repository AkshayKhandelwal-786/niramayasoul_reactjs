import React, { useEffect, useState } from "react";
import axiosConfig from "../../services/axiosToken";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";
import { useNavigate } from "react-router-dom";

function MyMedOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(5); // Default to show 5 orders
  const [statusFilter, setStatusFilter] = useState("all"); // Status filter

  useEffect(() => {
    // Replace with your API endpoint
    const fetchOrders = async () => {
      try {
        const response = await axiosConfig.get('/orders');
        setOrders(response.data.data);
        setFilteredOrders(response.data.data); // Initially show all orders
      } catch (error) {
        console.error("Error fetching the orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);

    if (status === "all") {
      setFilteredOrders(orders); // Show all orders if "all" is selected
    } else {
      setFilteredOrders(orders.filter(order => order.order_status === status));
    }
    setVisibleOrders(5); // Reset visible orders when switching filters
  };

  // Load more orders by increasing visible count
  const handleLoadMore = () => {
    setVisibleOrders((prev) => prev + 5); // Show 5 more orders
  };

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


  const handleViewDetails = (order) => {
    navigate("/dashboard/medicines-orders-details", { state: { order : order } });

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
                <div className="personal-info d-flex justify-content-between">
                  <div>
                    <h3>Medicine Orders</h3>
                    <span>Here is the details</span>
                  </div>
                  <div className="form-group mt-3" style={{ width: "200px" }}>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Medicine Orders List */}
                <div className="order-list">
                  {filteredOrders.length > 0 ? (
                    filteredOrders
                      .slice(0, visibleOrders) // Show only the visible number of orders
                      .map((order, index) => (
                        <div key={index} className="order-item p-3 mb-3 order-box">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="order-icon me-3">
                                <img src="/img/orderListIcon.png" alt="Medicines" />
                              </div>
                              <div>
                                <p className="mb-1 fw-bold">Order #{order.id}</p>
                                <p className="mb-1">
                                  Quantity: {order.cart.cart_items.reduce((acc, item) => acc + item.quantity, 0)} <br />
                                  Subtotal: ₹{order.cart.total}
                                </p>
                                <p className="mb-0 text-muted">{order.order_date}</p>
                              </div>
                            </div>
                            <div>
                              <span className={`status-badge ${getStatusClass(order.order_status)}`}>
                                {order.order_status.toUpperCase()}
                              </span>
                              {/* VIEW DETAILS */}
                              
                            </div>
                            <button className="btn btn-outline-success" onClick={() => handleViewDetails(order)}>
                              View Details
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>No orders found.</p>
                  )}
                </div>

                {/* Load More Button */}
                {visibleOrders < filteredOrders.length && (
                  <div className="text-center mt-3">
                    <button className="btn btn-primary buttonCustom" onClick={handleLoadMore}>
                      Load More
                    </button>
                  </div>
                )}
                {/* End of Medicine Orders List */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyMedOrders;
