async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const message = input.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div class="message user">${message}</div>`;
    input.value = "";

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();

        chatBox.innerHTML += `<div class="message bot">${data.reply}</div>`;
    } catch {
        chatBox.innerHTML += `<div class="message bot">Server bermasalah</div>`;
    }
}
