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
import axiosConfig from "../../services/axiosToken";
import axiosConfigWeb from "../../services/axiosConfig";

function Signup() {
  const navigate = useNavigate();

  // State variables for form fields and errors
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [errors, setErrors] = useState({});

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Changed to an array for 6 digit OTP
  const [verificationId, setVerificationId] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const otpInputs = useRef([]);

  const [token, setToken] = useState("");
  const secretKey = import.meta.env.VITE_JWT_KEY;

  const handleGenerateToken = () => {
    const payload = {
      phone_number: mobile,
      authenticated: true, // Example option
    };

    // Define header and payload for the JWT
    const header = { alg: "HS256", typ: "JWT" };

    // Create JWT using the KJUR library
    const jwtToken = KJUR.jws.JWS.sign(
      null, // Algorithm passed directly from header
      JSON.stringify(header),
      JSON.stringify(payload),
      { utf8: secretKey } // Secret key in utf8 format for signing
    );

    return jwtToken;
  };

  // Validation function
  const validate = () => {
    const errors = {};
    if (!firstName) errors.firstName = "First Name is required.";
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      errors.firstName = "First Name must contain only letters.";
    }

    if (!lastName) errors.lastName = "Last Name is required.";
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      errors.lastName = "Last Name must contain only letters.";
    }

    if (!mobile) {
      errors.mobile = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = "Mobile Number must be 10 digits.";
    }

    if (!email) {
      errors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email Address is invalid.";
    }

    if (!age) {
      errors.age = "Age is required.";
    } else if (!/^\d+$/.test(age)) {
      errors.age = "Age must be a valid number.";
    } else if (age < 0 || age > 120) {
      errors.age = "Age must be between 0 and 120.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    );
  };

  const handlePhoneNumberSubmit = (e) => {
    e.preventDefault();
    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;
    const formattedPhoneNumber = `+91${mobile}`; // Prepend +91 to the phone number

    signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setShowOTP(true); // Show OTP input after sending
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to send OTP.");
      });
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
    const otpString = otp.join(""); // Join the array elements into a string without commas
    const credential = PhoneAuthProvider.credential(verificationId, otpString);
    
    signInWithCredential(auth, credential)
      .then(async (result) => {
        console.log(result.user);
  
        // Generate the JWT token as before
        const jwtToken = handleGenerateToken(); // Assuming you have this function defined
  
        // Here, you can get the device token if you have a method for it
        const deviceToken = ""; // Replace with your method to get the device token
        try {
          const response = await axiosConfigWeb.post(`/customers/signup`, {
            customer: {
              jwt_token: jwtToken, // Use the generated token
              device_token: deviceToken, // Include device token
              first_name: firstName,
              last_name: lastName,
              email: email,
              age: age,
              gender: gender
            },
          });
  
          // Check the response status code
          if (response.data.status.code === 200) {
            const tokenBearer = response.headers['authorization'];
            const token = tokenBearer.replace("Bearer ", "");
          
            // Store the token in localStorage
            localStorage.setItem("token", token);
          
            // Store customer information in localStorage
            const customer = response.data.status.data.customer;
            localStorage.setItem("userid", customer.id);
            localStorage.setItem("userName", customer.name || "Unknown");
            localStorage.setItem("userEmail", customer.email || "");
            localStorage.setItem("userPhone", customer.phone_number || "");
            localStorage.setItem("userImage", customer.image_url || "");
          
            toast.success("Signup successful!");
          
            // Handle redirect
            const redirectURL = localStorage.getItem("redirectURL");
            if (redirectURL) {
              // Ensure only one leading slash
              const formattedRedirectURL = redirectURL.startsWith('/') ? redirectURL : '/' + redirectURL;
              navigate(formattedRedirectURL);
            } else {
              navigate("/dashboard");
            }
          } else if (response.data.status.code === 401 && response.data.status.message === "Customer is already signed up. Please login") {
            toast.error("Customer is already signed up. Please login.");
            navigate("/login");
          } else {
            toast.error("Signup failed. Please try again.");
          }
          
        } catch (error) {
          console.error("Error in signup request:", error);
          toast.error("Customer is already signed up. Please login.");
          navigate("/login"); // Optionally, navigate to the login page

        }
      })
      .catch((error) => {
        console.error("OTP verification failed:", error);
        toast.error("Failed to verify OTP. Please try again.");
      });
  };
  


  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (validate()) {
      handlePhoneNumberSubmit(e); // Proceed with phone number verification
    }
  };

  return (
    <>
      <Toaster />
      <div className="login-form">
        <div className="container-fluid p-0 h-100 d-lg-flex align-items-stretch">
          <div className="col-lg-6 fixed">
            <div className="bg-login h-100 text-center d-flex align-items-center flex-column justify-content-center">
              <Link to={'/'} reloadDocument><img className="img-fluid" src="/img/plus-logo.svg" alt="" /></Link>
              <div className="login-content">
                <span>Prioritizing Your Family's Health and Wellness</span>
                <p>Please enter the below details to create an account.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 offset-lg-6 d-flex align-items-center">
            <div className="login signups">
             
              {!showOTP ? (
                <>
                 <h2>Sign Up</h2>
                 <span>To proceed, kindly provide the required details below.</span>
                <form onSubmit={handleSubmit}>
                  <div className="input spacing25">
                    <div className="form-group group-spacing">
                      <div className="row">
                        <div className="col-lg-12 mt-4">
                          <label>First Name</label>
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Enter First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                        </div>
                      </div>
                    </div>
                    <div className="form-group group-spacing">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Last Name</label>
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Enter Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                        </div>
                      </div>
                    </div>
                    <div className="form-group group-spacing">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Mobile</label>
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Enter Mobile Number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                          />
                          {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                        </div>
                      </div>
                    </div>
                    <div className="form-group group-spacing">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Email Address</label>
                          <input
                            type="email"
                            className="form-control rounded"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>
                      </div>
                    </div>
                    <div className="form-group group-spacing">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Age</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                          />
                          {errors.age && <small className="text-danger">{errors.age}</small>}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Gender</label>
                          <select name="gender" className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="button">
                    <button type="submit">Continue</button>
                  </div>
                </form>
                </>
              ) : (
                <>
                <h2>OTP Verification</h2>
                <p>Please enter one time password (OTP) that is sent to {mobile}</p>

                <form onSubmit={onSubmitOtp}>
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
                </>
              )}
              <div className="continue position-relative text-center mt-5">
                <span>Or continue with</span>
              </div>
              
              <div className="newuser d-flex align-items-center justify-content-center">
                <span className="p-0">Already have an account?</span>
                <Link to="/login">Log In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div> {/* This is needed for reCAPTCHA */}
    </>
  );
}

export default Signup;
