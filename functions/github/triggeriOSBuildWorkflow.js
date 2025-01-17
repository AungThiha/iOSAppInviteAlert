const axios = require('axios');

const triggeriOSBuildWorkflow = async () => {
  try {

    const token = Buffer.from(process.env.GITHUB_REST_API_TOKEN_BASE64, 'base64').toString('utf-8');
    const url = `https://api.github.com/repos/AungThiha/iOSAppAccessAutomation/actions/workflows/build_ios_app.yml/dispatches`;
    const headers = {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }

    const body = {
      ref: 'main'
    };

    const response = await axios.post(
      url, body, { headers: headers }
    );

    if (response.status === 200) {
      console.log('iOS build workflow successfully triggered');
      return true;
    } else {
      console.log("Response from iOS build workflow:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error from iOS build workflow:", error.response ? error.response.data : error.message);
    return false;
  }
};

module.exports = { triggeriOSBuildWorkflow };
