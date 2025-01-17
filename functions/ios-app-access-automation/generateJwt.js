const jwt = require('jsonwebtoken');

const decodeBase64 = (base64String) => Buffer.from(base64String, 'base64').toString('utf-8');

const generateJWT = () => {
  /*
  key id is generating using below command
  openssl rsa -in public_key.pem -pubin -outform der | openssl dgst -sha256
  */
  const keyId = decodeBase64(process.env.IOS_APP_INVITE_ALERT_PRIVATE_KEY_ID_BASE64);
  const issuerId = decodeBase64(process.env.IOS_APP_INVITE_ALERT_PRIVATE_KEY_ISSUER_ID_BASE64);
  const privateKey = decodeBase64(process.env.IOS_APP_INVITE_ALERT_PRIVATE_KEY_BASE64);
  const expirationTime = Math.floor(Date.now() / 1000) + 60; // 1 minute from now

  const jwtPayload = {
    iss: issuerId,
    iat: Math.floor(Date.now() / 1000),
    exp: expirationTime
  };

  return jwt.sign(
    jwtPayload, 
    privateKey, 
    { algorithm: 'RS256', header: { kid: keyId } }
  );
};

module.exports = { generateJWT };
