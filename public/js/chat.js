async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const message = input.value.trim();

    if (!message) return;

    chatBox.innerHTML += `<div class="user">${message}</div>`;
    input.value = "";

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        chatBox.innerHTML += `<div class="bot">${data.reply}</div>`;
    } catch (error) {
        console.error("Error:", error);
        chatBox.innerHTML += `<div class="bot">⚠️ Terjadi kesalahan koneksi</div>`;
    }
}
