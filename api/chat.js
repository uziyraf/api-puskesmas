const dialogflow = require("@google-cloud/dialogflow");
const { v4: uuidv4 } = require("uuid");

const sessionClient = new dialogflow.SessionsClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const sessionPath = sessionClient.projectAgentSessionPath(
      process.env.PROJECT_ID,
      uuidv4()
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: { text: message, languageCode: "id" }
      }
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.status(200).json({ reply: result.fulfillmentText });
  } catch (err) {
    res.status(500).json({ reply: "Terjadi kesalahan server" });
  }
};
