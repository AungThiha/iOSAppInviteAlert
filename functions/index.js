const { info } = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
// const { onRequest } = require("firebase-functions/v2/https");
const {
  onNewTesterIosDevicePublished,
} = require("firebase-functions/v2/alerts/appDistribution");
// const axios = require('axios');

initializeApp();

// found at https://github.com/firebase/functions-samples/blob/d2532012d6089677ced06f6a3f14155953847563/Node/alerts-to-discord/functions/index.js#L108
exports.postuuidtoapple = onNewTesterIosDevicePublished(async (event) => {
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
});

// exports.showMessage = onRequest(async (req, res) => {
//   res.json({result: `just a message`});
// });
