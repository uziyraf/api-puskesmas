require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dialogflow = require("@google-cloud/dialogflow");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

/* ======================
   ENV VALIDATION
====================== */

const projectId = process.env.PROJECT_ID;

if (!projectId) {
  console.error("❌ ERROR: PROJECT_ID tidak ditemukan di .env");
  process.exit(1);
}

console.log("✅ PROJECT_ID:", projectId);

/* ======================
   DIALOGFLOW CLIENT
====================== */

const sessionClient = new dialogflow.SessionsClient({
  credentials: process.env.GOOGLE_CREDENTIALS
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
    : undefined,
});


/* ======================
   CHAT API
====================== */

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Pesan kosong" });
  }

  const sessionId = uuidv4();

  try {
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
      reply: result.fulfillmentText || "Maaf, saya belum memahami pertanyaan Anda.",
    });

  } catch (error) {
    console.error("Dialogflow error:", error);
    res.status(500).json({
      reply: "⚠️ Terjadi kesalahan pada chatbot",
    });
  }
});

/* ======================
   SERVER
====================== */

const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Server jalan di http://localhost:${port}`);
  });
}

module.exports = app;
