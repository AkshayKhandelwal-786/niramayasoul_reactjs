import React, { useEffect, useState } from "react";
import axiosConfig from "../../services/axiosToken";

function PromoModel({ isOpen, onClose, promoType, bookingID, fetchBookings }) {
  const [promoCode, setPromoAvailable] = useState([]);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [activeCouponCode, setActiveCouponCode] = useState(null); // State to track which coupon is being applied

  useEffect(() => {
    checkPromo();
  }, []);

  const checkPromo = async () => {
    try {
      const response = await axiosConfig.get("/coupons");
      setPromoAvailable(response.data.data);
    } catch (error) {
      console.error("Error checking promo availability", error);
    }
  };

  const applyCoupon = async (couponCode) => {
    setApplyingCoupon(true); // Start loading state
    setActiveCouponCode(couponCode); // Set the active coupon being applied

    const data = {
      couponable_type: promoType,
      couponable_id: bookingID,
      coupon_code: couponCode
    };

    try {
      const response = await axiosConfig.post("/coupons/apply_coupon", data);
      console.log("Coupon applied successfully:", response.data);

      fetchBookings();
      onClose();
    } catch (error) {
      console.error("Error applying coupon:", error);
    } finally {
      setApplyingCoupon(false); // End loading state
      setActiveCouponCode(null); // Reset active coupon after applying
    }
  };

  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
    <div
      className="modal fade top show"
      id="exampleModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-mdb-backdrop="static"
      data-mdb-keyboard="true"
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-dialog-centered mw-5">
        <div className="modal-content">
          <div className="modal-header header24">
            <h5 className="modal-title" id="exampleModalLabel">
              Top Coupons For You
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body bodycard">
            {promoCode.map((promo) => (
              <div
                key={promo.code}
                className="cupon-card d-flex justify-content-between align-items-center position-relative mb-78"
              >
                <div className="shap-round-l"></div>
                <div className="shap-round-r"></div>
                <div className="d-flex align-items-center">
                  <div className="percent position-relative">
                    <span>%</span>
                    <img
                      className="dots-cupon"
                      src="img/dots-cupon.svg"
                      alt=""
                    />
                  </div>
                  <div className="cupon-text">
                    <p className="m-0">{promo.code}</p>
                    <span>Save ₹{promo.discount_amount} on this order</span>
                  </div>
                </div>
                <div className="cupon-action">
                  <button
                    className="cupon-btn"
                    onClick={() => applyCoupon(promo.code)}
                    disabled={applyingCoupon && activeCouponCode === promo.code} // Disable button only for active coupon
                  >
                    {applyingCoupon && activeCouponCode === promo.code ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromoModel;
