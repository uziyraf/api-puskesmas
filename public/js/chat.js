async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const message = input.value.trim();

    if (!message) return;

    // Escape HTML untuk keamanan
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    chatBox.innerHTML += `
        <div class="message user">
            <div class="user-text">${escapeHtml(message)}</div>
        </div>
    `;

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

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

        chatBox.innerHTML += `
            <div class="message bot">
                <div class="bot-text">${escapeHtml(data.reply)}</div>
            </div>
        `;

    } catch (error) {
        console.error("Error:", error);
        chatBox.innerHTML += `
            <div class="message bot">
                <div class="bot-text">⚠️ Terjadi kesalahan koneksi</div>
            </div>
        `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}