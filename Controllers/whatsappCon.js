import axios from "axios";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;


export async function sendButton(to, text, buttons) {
  const formattedButtons = buttons.map((btn) => ({
    type: "reply",
    reply: { id: btn.id, title: btn.title },
  }));
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text },
          action: { buttons: formattedButtons },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Button sent:", res.data);
    
  } catch (error) {
    console.error(
      "Error sending button:",
      error.response ? error.response.data : error.message
    );
  }
}

export async function sendText(to, text) {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Text sent:", res.data);
  } catch (error) {
    console.error(
      "Error sending text:",
      error.response ? error.response.data : error.message
    );
  }
}

// ------------------- Flow Logic -------------------
export async function handleUserMessage(userNumber, message) {
  await sendButton(userNumber, "How can i help you?", [
    { id: "buy_product", title: "Buy Product" },
    { id: "talk_human", title: "Talk to Human" },
    { id: "service", title: "Services" },
  ]);
}

export async function handleButtonClick(userNumber, buttonId) {
    if (buttonId === "buy_product") {
      await sendText(userNumber, "Great! What product are you interested in?");
    } else if (buttonId === "service") {
        await sendButton(userNumber, "Choose a service:", [
          { id: "mobile_service", title: "Mobile" },
          { id: "internet_service", title: "Internet" },
          { id: "tv_service", title: "TV" },    
        ])
    } else if (buttonId === "mobile_service") {
        await sendText(userNumber, "You selected Mobile Service. Our team will contact you shortly.");
    } else if (buttonId === 'internet_service') {
        await sendText(userNumber, 'You selected Internet Service. Our team will contact you shortly.');
    } else if (buttonId === 'tv_service') {
        await sendText(userNumber, 'You selected TV Service. Our team will contact you shortly.');
    } else if (buttonId === "talk_human") {
        await sendText(userNumber, "Please wait while we connect you to a human agent.");
    } else {
      await sendText(userNumber, "Sorry, I didn't understand that selection.");
    }   
}