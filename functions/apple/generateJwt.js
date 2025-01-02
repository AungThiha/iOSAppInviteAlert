const fs = require('fs');
const jwt = require('jsonwebtoken');

const decodeBase64 = (base64String) => Buffer.from(base64String, 'base64').toString('utf-8');

/**
 * Generate a JWT for Apple Connect API.
 * @returns {string} - The generated JWT.
 */
const generateJWT = () => {

  const keyId = decodeBase64(process.env.APPLE_CONNECT_API_KEY_BASE64);
  const issuerId = decodeBase64(process.env.APPLE_CONNECT_PRIVATE_KEY_ISSUER_ID_BASE64);
  const privateKey = decodeBase64(process.env.APPLE_CONNECT_PRIVATE_KEY_BASE64);
  const expirationTime = Math.floor(Date.now() / 1000) + 60; // 1 minute from now

  const jwtPayload = {
    iss: issuerId,
    iat: Math.floor(Date.now() / 1000),
    exp: expirationTime,
    aud: 'appstoreconnect-v1'
  };

  return jwt.sign(jwtPayload, privateKey, { algorithm: 'ES256', header: { kid: keyId } });
};

module.exports = { generateJWT };
