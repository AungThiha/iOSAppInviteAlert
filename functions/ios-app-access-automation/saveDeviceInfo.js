const axios = require('axios');
const { encryptWithAes256Gcm } = require("../crypto/aes");

const saveDeviceInfo = async (udid, deviceModel, email) => {
  try {

    const base64Key = process.env.IOS_APP_INVITE_ENCRYPTION_KEY_BASE64;
    const encryptionKey = Buffer.from(base64Key, "base64");

    const plaintext = {
      email: email,
      udid: udid,
      device_model: deviceModel,
    };

    const { encryptedData, iv, authTag } = encryptWithAes256Gcm(encryptionKey, plaintext);
    console.log("encryption successful");

    const url = `https://iosappaccessautomation-9db62b5fb979.herokuapp.com/user/device`;
    const response = await axios.post(url, {
      encryptedData,
      iv,
      authTag
    });

    if (response.status === 200) {
      console.log('Device info successfully saved');
      return true;
    } else {
      console.log("Response from iosappaccessautomation:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error device info:", error.response ? error.response.data : error.message);
    return false;
  }
};

module.exports = { saveDeviceInfo };