import React, { useState, useEffect } from 'react';
import axiosConfig from "../../services/axiosToken";
import Layout from '../../components/Layout';
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";

function MyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1); // Page number state
  const [loading, setLoading] = useState(false); // Loading state
  const [itemsPerPage] = useState(5); // Number of items per page
  const [totalNotifications, setTotalNotifications] = useState(0); // Total number of notifications

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const fetchNotifications = async (page) => {
    setLoading(true);
    try {
      const response = await axiosConfig.get('/notifications', {
        page: page,
        query: ""
      });
      setNotifications(response.data.data); // Set notifications from the API response
      setTotalNotifications(response.data.data.length); // Set the total number of notifications
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await axiosConfig.post('/notifications/mark_all_read');
      fetchNotifications(page); // Refresh notifications on the same page
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Mark individual notification as read/unread
  const handleMarkAsRead = async (notificationId, isRead) => {
    try {
      const url = `/notifications/${notificationId}/${isRead ? 'unread' : 'read'}`;
      await axiosConfig.put(url);
      fetchNotifications(page); // Refresh notifications on the same page
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  // Calculate total pages based on total notifications and items per page
  const totalPages = Math.ceil(totalNotifications / itemsPerPage);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
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
                <a href="#">Notifications</a>
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
                <div className="personal-info mb-4 d-flex justify-content-between">
                  <div>
                    <h3>Notifications</h3>
                    <span>Below are the details</span>
                  </div>
                  
                </div>

                {/* Notifications list */}
                <div className="card-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        className={`card mb-3 ${
                          notification.read ? 'read-notification' : 'unread-notification'
                        }`}
                        key={notification.id}
                      >
                        <div className="row g-0 align-items-center">
                          <div className="col-md-2">
                            <img
                              src={notification.image_url}
                              alt="Notification"
                              className="img-fluid w-50 h-50 mx-auto d-block"
                            />
                          </div>
                          <div className="col-md-6">
                            <div className="card-body">
                              <p className="card-title">{notification.title}</p>
                              <p className="card-text">{notification.message}</p>
                              <p className="card-text">
                                <small className="text-muted">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </small>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 d-flex align-items-center justify-content-end">
                            {/* Mark as Read/Unread button */}
                            <button
                              className="btn btn-outline-primary me-2"
                              onClick={() => handleMarkAsRead(notification.id, notification.read)}
                            >
                              {notification.read ? 'Mark as Unread' : 'Mark as Read'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No notifications found.</p>
                  )}
                </div>
                {/* End of Notifications list */}

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-primary"
                    disabled={page === 1}
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    disabled={page === totalPages}
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
                {loading && <div className="text-center mt-4">Loading...</div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyNotifications;
