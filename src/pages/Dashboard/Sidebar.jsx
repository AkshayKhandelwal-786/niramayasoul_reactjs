import React, { useEffect, useState } from "react";
import axiosConfig from "../../services/axiosToken";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'; // Assuming Bootstrap Modal is used

function Sidebar() {
  const [profileData, setProfileData] = useState({
    name: "User Name",
    email: "User email",
    image_url: "/img/avatar.png"
  });
  const [showModal, setShowModal] = useState(false); // Modal state
  const [selectedImage, setSelectedImage] = useState(null); // Selected image file
  const [uploading, setUploading] = useState(false); // Uploading state for loader

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosConfig.get("/customers/profile");
        const { data } = response.data;

        // Update profile data with the API response
        setProfileData({
          name: data.name || "User Name",
          email: data.email || "User email",
          image_url: data.image_url || "/img/profile-doc.png"
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      setUploading(true);
      const response = await axiosConfig.put("/customers/update_image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update the profile image after successful upload
      setProfileData(prevData => ({
        ...prevData,
        image_url: response.data.data.image_url // Assuming the response contains the updated image URL
      }));
      
      setShowModal(false); // Close the modal after upload
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="col-lg-3">
      <div className="doctor-main">
        <div className="doctor-profile-card">
          <div className="shap-doc"></div>
          <div className="doc-pic position-relative">
            <div className="pic-main">
              <img src={profileData.image_url} alt="Profile" />
            </div>
            {/* Trigger the modal to open when clicking the camera icon */}
            <img 
              src="/img/camera.svg" 
              alt="Change profile" 
              onClick={() => setShowModal(true)} 
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="doc-information">
            <div className="doc-title">
              <h3>{profileData.name}</h3>
            </div>
            <div className="doc-dis-profile">
              <span>{profileData.email}</span>
            </div>
          </div>
        </div>
        <div className="list">
          <h3 className="title-doc">MY STUFF</h3>
          <ul className="list-unstyled d-flex flex-column gap-7">
            <li>
              <Link to={'/dashboard/wish-list'}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-3">
                    <img src="/img/heart.svg" alt="Wishlist" />
                    <span>My Wishlist</span>
                  </div>
                  <img src="/img/arrow-right1.svg" alt="Arrow" />
                </div>
              </Link>
            </li>
            {/* <li>
              <Link to={'/dashboard/offers'}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-3">
                    <img src="/img/offericon.svg" alt="Offers" />
                    <span>Coupons</span>
                  </div>
                  <img src="/img/arrow-right1.svg" alt="Arrow" />
                </div>
              </Link>
            </li> */}
            <li>
              <Link to={'/dashboard/delivery-address'}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-3">
                    <img src="/img/locationmarker.svg" alt="Delivery Address" />
                    <span>Delivery Address</span>
                  </div>
                  <img src="/img/arrow-right1.svg" alt="Arrow" />
                </div>
              </Link>
            </li>
            <li>
              <Link to={'/dashboard/my-notifications'}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-3">
                    <img src="/img/notificatioalert.svg" alt="Notifications" />
                    <span>Notifications</span>
                  </div>
                  <img src="/img/arrow-right1.svg" alt="Arrow" />
                </div>
              </Link>
            </li>
            {/* <li>
              <Link to={'/dashboard/change-password'}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-3">
                    <img src="/img/lock.svg" alt="Change Password" />
                    <span>Change Password</span>
                  </div>
                  <img src="/img/arrow-right1.svg" alt="Arrow" />
                </div>
              </Link>
            </li> 
            <li>
              <Link to={'/dashboard/feedback'}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-3">
                    <img src="/img/start.svg" alt="Rate Us" />
                    <span>Rate Us</span>
                  </div>
                  <img src="/img/arrow-right1.svg" alt="Arrow" />
                </div>
              </Link>
            </li>*/}
            <li>
              <Link to={'/logout'}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-3">
                    <img src="/img/logout.svg" alt="Logout" />
                    <span>Logout</span>
                  </div>
                  <img src="/img/arrow-right1.svg" alt="Arrow" />
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal for uploading profile image */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
          <button 
            className="btn btn-primary buttonCustom" 
            onClick={handleImageUpload} 
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Sidebar;
