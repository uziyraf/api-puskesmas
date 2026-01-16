const API_URL = 'https://api-puskesmas.vercel.app/api/chat';

async function sendMessage(text) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    return data.reply;
}
