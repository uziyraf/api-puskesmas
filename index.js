const express = require("express");
const bodyParser = require("body-parser");
const dialogflow = require("@google-cloud/dialogflow");
const { v4: uuidv4 } = require("uuid");
const open = require("open");
const cors = require("cors");

const app = express();

app.use(cors());
/* ======================
   MIDDLEWARE
====================== */
app.use(bodyParser.json());

// ⬇️ INI YANG KAMU TANYAKAN (WAJIB DI SINI)
app.use(express.static("public"));

/* ======================
   DIALOGFLOW CONFIG
====================== */
require('dotenv').config();

const sessionClient = new dialogflow.SessionsClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
});

const projectId = process.env.PROJECT_ID;
module.exports = { sessionClient, projectId };

/* ======================
   API CHATBOT
====================== */
app.post("/chat", async (req, res) => {
  const message = req.body.message;
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

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      reply: result.fulfillmentText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Terjadi kesalahan server" });
  }
});

/* ======================
   SERVER
====================== */


const port = process.env.PORT || 3000; // <-- GANTI INI

// Cek apakah sedang berjalan di Vercel?
if (process.env.VERCEL) {
  // Kalau di Vercel, export app-nya (jangan di-listen)
  module.exports = app;
} else {
  // Kalau di laptop (lokal), jalankan listen seperti biasa
  app.listen(port, () => {
    console.log(`🚀 Server jalan di port ${port}`);
  });
}
//   // buka otomatis di Chrome
//   open("http://localhost:2000", {
//     app: {
//       name: "chrome"
//     }
//   });
// });
