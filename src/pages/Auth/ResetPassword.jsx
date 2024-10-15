import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
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
  const handleReset = () => {
    // Perform password reset logic here
    // ...

    // After successful reset, navigate to the login page
    navigate("/login");
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
                <p>Please reset your password by entering a new password.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center">
            <div className="login">
              <h2>Reset Password</h2>
              <span>
                To proceed, kindly provide the required details below.
              </span>
              <div className="input">
                <div className="form-group">
                  <div className="row">
                    <div className="col-lg-12">
                      <label>New Password </label>
                      <div className="passoword-show">
                        <input
                          type="search"
                          className="form-control rounded"
                          placeholder="New Password "
                          aria-label="New Password "
                          aria-describedby="search-addon"
                        />
                        <img src="/img/eye.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group spacing25">
                  <div className="row">
                    <div className="col-lg-12">
                      <label>Confirm Password </label>
                      <div className="passoword-show">
                        <input
                          type="search"
                          className="form-control rounded"
                          placeholder="Confirm Password "
                          aria-label="Confirm Password "
                          aria-describedby="search-addon"
                        />
                        <img src="/img/eye.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button">
                <button type="button" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
