async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();

  if (!message) return;

  // ===============================
  // Bubble USER
  // ===============================
  chatBox.innerHTML += `
    <div class="message user">
      ${message}
    </div>
  `;

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // ===============================
    // Kirim ke server
    // ===============================
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // ===============================
    // Bubble BOT
    // ===============================
    chatBox.innerHTML += `
      <div class="message bot">
        ${data.reply}
      </div>
    `;

  } catch (error) {
    // ===============================
    // Error handling (server down)
    // ===============================
    chatBox.innerHTML += `
      <div class="message bot">
        Terjadi kesalahan server
      </div>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
