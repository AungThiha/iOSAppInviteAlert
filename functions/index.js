const { info } = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { onRequest } = require("firebase-functions/v2/https");
const {
  onNewTesterIosDevicePublished,
} = require("firebase-functions/v2/alerts/appDistribution");
const { registerUDID } = require("./apple/registerUDID");
const { saveDeviceInfo } = require("./ios-app-access-automation/saveDeviceInfo");
const { triggeriOSBuildWorkflow } = require("./github/triggeriOSBuildWorkflow");

initializeApp();

// found at https://github.com/firebase/functions-samples/blob/d2532012d6089677ced06f6a3f14155953847563/Node/alerts-to-discord/functions/index.js#L108
exports.postuuidtoapple = onNewTesterIosDevicePublished(
  // below are cloud secrets stored in Firebase Cloud Secret Managers
  // https://firebase.google.com/docs/functions/config-env?gen=2nd#secret_parameters
  { 
    secrets: [
      "APPLE_CONNECT_API_KEY_BASE64",
      "APPLE_CONNECT_PRIVATE_KEY_ISSUER_ID_BASE64",
      "APPLE_CONNECT_PRIVATE_KEY_BASE64",
      "IOS_APP_INVITE_ALERT_PRIVATE_KEY_ID_BASE64",
      "IOS_APP_INVITE_ALERT_PRIVATE_KEY_ISSUER_ID_BASE64",
      "IOS_APP_INVITE_ALERT_PRIVATE_KEY_BASE64",
      "GITHUB_REST_API_TOKEN_BASE64"
    ]
  },
  async (event) => {
    const appId = event.appId;
    const {
      testerDeviceIdentifier,
      testerDeviceModelName,
      testerEmail,
      testerName,
    } = event.data.payload;

    const message = `
  📱 New iOS device registered by ${testerName} <${testerEmail}> for ${appId}

  UDID **${testerDeviceIdentifier}** for ${testerDeviceModelName}
  `;
    info(message);

    const saveDeviceInfoSuccess = saveDeviceInfo(
        testerDeviceIdentifier,
        testerDeviceModelName,
        testerEmail
      );
    if (!saveDeviceInfoSuccess) { return; }

    const testerNameApple = `${testerName} ${testerDeviceIdentifier.slice(-5)}`
    const registerUDIDSuccess = registerUDID(
        testerNameApple, testerDeviceIdentifier
      );
    if (!registerUDIDSuccess) { return; }

    triggeriOSBuildWorkflow()
});

/*exports.registerUDIDCall = onRequest(
  { 
    secrets: [
      "APPLE_CONNECT_API_KEY_BASE64",
      "APPLE_CONNECT_PRIVATE_KEY_ISSUER_ID_BASE64",
      "APPLE_CONNECT_PRIVATE_KEY_BASE64"
    ]
  },
  async (req, res) => {
    const registerUDIDSuccess = registerUDID(
          "hello", "hey"
        );
    res.json({result: registerUDIDSuccess});
  }
);*/

/*
exports.saveDeviceInfoCall = onRequest(
  { 
    secrets: [
      "IOS_APP_INVITE_ALERT_PRIVATE_KEY_ID_BASE64",
      "IOS_APP_INVITE_ALERT_PRIVATE_KEY_ISSUER_ID_BASE64",
      "IOS_APP_INVITE_ALERT_PRIVATE_KEY_BASE64"
    ]
  },
  async (req, res) => {
    const saveDeviceInfoSuccess = saveDeviceInfo(
          "ffffffffffffffffffffffffffffffffffffffff",
          "haha",
          "hoo"
        );
    res.json({result: saveDeviceInfoSuccess});
  }
);*/

/*exports.triggeriOSBuildWorkflow = onRequest(
  { 
    secrets: [
      "GITHUB_REST_API_TOKEN_BASE64"
    ]
  },
  async (req, res) => {
    triggeriOSBuildWorkflow();
    res.json({result: "completed"});
  }
);*/