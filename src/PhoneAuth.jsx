// src/PhoneAuth.js
import React, { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
        },
      },
      auth
    );
  };

  const onSignInSubmit = (e) => {
    e.preventDefault();
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmitOtp = (e) => {
    e.preventDefault();
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    signInWithCredential(auth, credential)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={onSignInSubmit}>
        <h3>Enter your phone number</h3>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
        />
        <button type="submit">Submit</button>
        <div id="recaptcha-container"></div>
      </form>

      <form onSubmit={onSubmitOtp}>
        <h3>Enter OTP</h3>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default PhoneAuth;
