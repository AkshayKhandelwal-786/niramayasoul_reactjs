import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPwd() {
  const navigate = useNavigate();

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.add("h-100");
    htmlElement.setAttribute("lang", "en");

    document.body.classList.add("h-100");
    document.getElementById("root").classList.add("h-100");

    return () => {
      htmlElement.classList.remove("h-100");
      htmlElement.removeAttribute("lang");
      document.body.classList.remove("h-100");
      document.getElementById("root").classList.remove("h-100");
    };
  }, []);

  const handleSendLink = () => {
    // Navigate to the OTP verification page
    navigate("/otp-verification");
  };

  return (
    <>  
      <div className="login-form h-100">
        <div className="container-fluid p-0 h-100 d-lg-flex align-items-stretch">
          <div className="col-lg-6">
            <div className="bg-login h-100 text-center d-flex align-items-center flex-column justify-content-center">
              <img className="img-fluid" src="/img/plus-logo.svg" alt="" />
              <div className="login-content">
                <span>Prioritizing Your Family's Health and Wellness</span>
                <p>
                  At the heart of everything we do is a commitment to ensuring
                  the health and wellness of your family
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center">
            <div className="login">
              <h2>Forgot Password</h2>
              <span>
                To proceed, kindly provide the required details below.
              </span>
              <div className="input">
                <div className="form-group">
                  <div className="row">
                    <div className="col-lg-12">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-control rounded"
                        placeholder="Enter Email Address"
                        aria-label="Enter Email Address"
                        aria-describedby="search-addon"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="button">
                <button type="button" onClick={handleSendLink}>
                  Send Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPwd;
