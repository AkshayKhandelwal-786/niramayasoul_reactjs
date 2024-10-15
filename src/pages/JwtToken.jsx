import React, { useState } from 'react';
import { KJUR } from 'jsrsasign';

function JwtExample() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [token, setToken] = useState('');
  const secretKey = '0b2177e64c8773cf14078f6969563c226cbe1e6fe0fad189c36bc6a9e62b3a4bdae95e579aefa6293c7fedbef4462fd1b52939d40053d42eb0e925ed664f776e'; // Use a strong secret in production

  const handleGenerateToken = () => {
    const payload = {
      phone_number: mobileNumber,
      authenticated: true, // Example option
    };

    // Define header and payload for the JWT
    const header = { alg: 'HS256', typ: 'JWT' };

    // Create JWT using the KJUR library
    const jwtToken = KJUR.jws.JWS.sign(
      null, // Algorithm passed directly from header
      JSON.stringify(header),
      JSON.stringify(payload),
      { utf8: secretKey } // Secret key in utf8 format for signing
    );

    setToken(jwtToken);
    console.log('Generated Token:', jwtToken);
  };

  const handleVerifyToken = () => {
    try {
      const isValid = KJUR.jws.JWS.verifyJWT(token, { utf8: secretKey }, { alg: ['HS256'] });
      if (isValid) {
        console.log('Token is valid.');
        const decoded = KJUR.jws.JWS.readSafeJSONString(KJUR.jws.JWS.parse(token).payloadPP);
        console.log('Decoded Token:', decoded);
      } else {
        console.error('Token is invalid.');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  };

  return (
    <div>
      <h1>JWT Generation Example using jsrsasign</h1>
      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />
      <button onClick={handleGenerateToken}>Generate JWT</button>
      <button onClick={handleVerifyToken} disabled={!token}>Verify JWT</button>

      {token && (
        <div>
          <h3>Generated JWT:</h3>
          <pre>{token}</pre>
        </div>
      )}
    </div>
  );
}

export default JwtExample;
