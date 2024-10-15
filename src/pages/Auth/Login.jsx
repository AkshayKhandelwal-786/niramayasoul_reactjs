import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Update with your correct path
import { toast, Toaster } from "react-hot-toast";
import { KJUR } from "jsrsasign";
import axiosConfigWeb from "../../services/axiosConfig";
import axiosConfig from "../../services/axiosToken";

const Login = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Changed to an array for 6 digit OTP
  const [verificationId, setVerificationId] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [phoneError, setPhoneError] = useState(""); // State for phone error message
  const otpInputs = useRef([]);

  const [loading, setLoading] = useState(false);

  const secretKey = import.meta.env.VITE_JWT_KEY;

  const handleGenerateToken = () => {
    const payload = {
      phone_number: phoneNumber,
      authenticated: true, // Example option
    };

    const header = { alg: "HS256", typ: "JWT" };

    const jwtToken = KJUR.jws.JWS.sign(
      null,
      JSON.stringify(header),
      JSON.stringify(payload),
      { utf8: secretKey }
    );

    return jwtToken;
  };

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          onSignInSubmit();
        },
      },
      auth
    );
  };

  const onSignInSubmit = (e) => {
    e.preventDefault();

    // Validate phone number before sending OTP
    if (!validatePhoneNumber(phoneNumber)) {
      return; // Exit if the phone number is invalid
    }
    try {
      setLoading(true);
      
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhoneNumber = `+91${phoneNumber}`;

      signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to send OTP.");
      }).finally(() => {
        setLoading(false); // Disable the loader when the process is done (success or failure)
      });
    } catch (error) {
      console.error(error);
      setLoading(false); // Disable the loader in case of an exception
    }  
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/; // Regex for a valid 10-digit mobile number
    if (!number) {
      setPhoneError("Mobile number cannot be empty.");
      return false;
    } else if (!phoneRegex.test(number)) {
      setPhoneError("Mobile number must be 10 digits.");
      return false;
    }
    setPhoneError(""); // Clear error if valid
    return true; // Valid phone number
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otpInputs.current.length - 1) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const otpString = otp.join(""); 
      const credential = PhoneAuthProvider.credential(verificationId, otpString);
      signInWithCredential(auth, credential)
      .then(async (result) => {
        console.log(result.user);

        const jwtToken = handleGenerateToken();

        const response = await axiosConfigWeb.post(`/customers/login`, {
          customer: {
            jwt_token: jwtToken,
            device_token: "", // Add your device token if needed
          },
        });
        if (response.data.status.code === 200) {
          const tokenBearer = response.headers['authorization'];
          const token = tokenBearer.replace("Bearer ", "");

          //localStorage.setItem("token", tokenBearer);
          localStorage.setItem("token", token);
          localStorage.setItem("userid", response.data.status.data.customer.id);
          localStorage.setItem("userName", response.data.status.data.customer || "Unknown");

          toast.success("Login successful!");
          // get locatstorage redirecturl 
          const redirectURL = localStorage.getItem("redirectURL");
          if (redirectURL) {
            // Ensure only one leading slash
            const formattedRedirectURL = redirectURL.startsWith('/') ? redirectURL : '/' + redirectURL;
            navigate(formattedRedirectURL);
          } else {
            navigate("/dashboard");
          }
        } else {
          toast.error("Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Invalid OTP.");
      }).finally(() => {
        setLoading(false); // Disable the loader when the process is done (success or failure)
      });
    } catch (error) {
      console.error(error);
      setLoading(false); // Disable the loader in case of an exception
    }
  };

  return (
    <>
      <Toaster />
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <div className="login-form mb-0">
        <div className="container-fluid p-0 vh-100 d-lg-flex align-items-stretch">
          <div className="col-lg-6">
            <div className="bg-login h-100 text-center d-flex align-items-center flex-column justify-content-center">
              <Link to={'/'} reloadDocument><img className="img-fluid" src="/img/plus-logo.svg" alt="" /></Link>
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
              
              <div className="input">
                {!showOTP ? (
                  <>
                  <h2>Log In</h2>
                  <span className="mb-4 d-blolck">
                    To proceed, kindly provide your mobile number to receive an OTP.
                  </span>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-lg-12">
                        <label className="mt-3">Mobile Number</label>
                        <input
                          type="tel"
                          className="form-control rounded"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter 10 Digit Mobile Number"
                          maxLength={10}
                        />
                        {phoneError && <small className="text-danger">{phoneError}</small>} {/* Show error message */}
                      </div>
                    </div>
                  </div>
                  </>
                ) : (
                  <form onSubmit={onSubmitOtp}>
                    <h2>OTP Verification</h2>
                  <span className="mb-4 d-blolck">
                  Please enter one time password (OTP) that is sent to {phoneNumber}
                  </span>
                    <label className="mt-3">Enter OTP</label>
                    <div className="otp d-flex justify-content-between">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          className="form-control rounded text-center"
                          maxLength="1"
                          ref={(el) => (otpInputs.current[index] = el)}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          value={digit}
                        />
                      ))}
                    </div>
                    <div className="button">
                      <button className="btn buttonCustom mb-4" type="submit">
                        Verify OTP
                      </button>

                      {/* <p className="resendotp d-flex align-items-center justify-content-center">Resend OTP in <span>00:24</span></p> */}
                    </div>
                  </form>
                )}
              </div>
              {!showOTP && (
                <div className="button">
                  <button type="button" onClick={onSignInSubmit}>
                    Continue
                  </button>
                </div>
              )}
              <div className="continue position-relative text-center mt-5">
                <span>Or continue with</span>
              </div>
              {/* <div className="social-account">
                <a href="#">
                  <img src="/img/google.svg" alt="" />
                  Log In with Google
                </a>
                <a href="#">
                  <img src="/img/facebook-account.svg" alt="" />
                  Log In with Facebook
                </a>
              </div> */}
              <div className="newuser d-flex align-items-center justify-content-center">
                <span className="p-0">New User?</span>
                <Link to="/signup">Create Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div> {/* This is needed for reCAPTCHA */}
    </>
  );
};

export default Login;
