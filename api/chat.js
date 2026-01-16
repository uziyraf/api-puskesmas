import dialogflow from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.json({ reply: "Pesan kosong" });
  }

  try {
    const projectId = process.env.PROJECT_ID;
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const sessionClient = new dialogflow.SessionsClient({
      credentials: credentials
    });

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
    console.error("Dialogflow error:", err);
    res.status(500).json({
      reply: "Terjadi kesalahan pada chatbot",
      error: err.message
    });
  }
}