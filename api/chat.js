require('dotenv').config();
const dialogflow = require('@google-cloud/dialogflow');

const projectId = process.env.PROJECT_ID;

const sessionClient = new dialogflow.SessionsClient();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId = 'default-session' } = req.body;

    const sessionPath =
      sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'id',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.status(200).json({
      reply: result.fulfillmentText,
    });
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ error: 'Dialogflow error' });
  }
};
