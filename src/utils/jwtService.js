// src/utils/jwtService.js
import jwt from 'jsonwebtoken';

const secret = import.meta.env.VITE_JWT_KEY // Replace with your secret key

const generateJWT = (payload) => {
  const options = {
    algorithm: 'HS256',
    expiresIn: '10h',
  };

  try {
    const token = jwt.sign(payload, secret, options);
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    return null;
  }
};

export default generateJWT;
