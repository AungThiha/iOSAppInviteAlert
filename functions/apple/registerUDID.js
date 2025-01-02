const axios = require('axios');
const { generateJWT } = require("./generateJWT");

const createDeviceRequest = (name, udid) => ({
  data: {
    type: 'devices',
    attributes: {
      name: name,
      platform: 'IOS', // https://developer.apple.com/documentation/appstoreconnectapi/bundleidplatform#possibleValues
      udid: udid
    }
  }
});

const registerUDID = async (name, udid) => {
  try {
    const token = generateJWT();
    const url = `https://api.appstoreconnect.apple.com/v1/devices`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(url, createDeviceRequest(name, udid), { headers: headers });

    if (response.status === 200) {
      console.log('Device successfully registered to Apple');
      return true;
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`Error: ${error.response?.status || error.code} - ${error.response?.data || error.message}`);
    return false;
  }
};

module.exports = { registerUDID };
