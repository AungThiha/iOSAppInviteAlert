const axios = require('axios');
const { generateJWT } = require("./generateJwt");

const saveDeviceInfo = async (udid, deviceModel, email) => {
  try {

    const token = generateJWT();
    const url = `https://iosappaccessautomation-9db62b5fb979.herokuapp.com/user/device`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const body = {
      email: email,
      udid: udid,
      device_model: deviceModel,
    };

    const response = await axios.post(
      url, body, { headers: headers }
    );

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