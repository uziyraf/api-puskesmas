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
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    chatBox.innerHTML += `
    <div class="message bot">
      ${data.reply}
    </div>
  `;

  } catch (error) {
    chatBox.innerHTML += `
    <div class="message bot">
      Terjadi kesalahan server
    </div>
  `;
  }

};
