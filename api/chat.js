import dialogflow from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.json({ reply: "Pesan kosong" });
  }

  try {
    const projectId = process.env.PROJECT_ID;
    const sessionClient = new dialogflow.SessionsClient();

    const sessionId = uuidv4();
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "id",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      reply:
        result.fulfillmentText ||
        "Maaf, saya belum memahami pertanyaan Anda.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Dialogflow error" });
  }
}
