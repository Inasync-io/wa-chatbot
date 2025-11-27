import e from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {
  handleFormFlow,
  sendSlotList,
  sendText,
  userSessions,
} from "./Controllers/whatsappCon.js";
import {
  handleUserMessage,
  handleButtonClick,
} from "./Controllers/whatsappCon.js";
import router from "./routers/router.js";
import { connectDB } from "./db/connectDb.js";

dotenv.config();

const app = e();
app.use(bodyParser.json());

// const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
// const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// async function sendButton(to, text, buttons) {
//   const formattedButtons = buttons.map((btn) => ({
//     type: "reply",
//     reply: { id: btn.id, title: btn.title },
//   }));

//   try {
//     const response = await axios.post(
//       `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to,
//         type: "interactive",
//         interactive: {
//           type: "button",
//           body: { text },
//           action: { buttons: formattedButtons },
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Button sent:", response.data);
//   } catch (error) {
//     console.error(
//       "Error sending button:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// async function sendText(to, text) {
//   try {
//     const response = await axios.post(
//       `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to,
//         type: "text",
//         text: { body: text },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Text sent:", response.data);
//   } catch (error) {
//     console.error(
//       "Error sending text:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// function chatLogs(userNumber, messageData) {
//   if (!chatData[userNumber]) {
//     chatData[userNumber] = [];
//   }
//   chatData[userNumber].push(messageData);
//   console.log("Stored message:", chatData[userNumber]);
// }

// console.log("Chat Data Store:", chatData);

// Flow Logic

// async function handleUserMessage(userNumber, message) {
//   chatLogs(userNumber, {
//     from: userNumber,
//     type: "text",
//     message,
//     direction: "inbound",
//     timestamp: new Date().toISOString(),
//   });
//   await sendButton(userNumber, "How can I help you?", [
//     { id: "buy_product", title: "Buy Product" },
//     { id: "service", title: "Service" },
//   ]);

//   chatLogs(userNumber, {
//     from: "bot",
//     type: "button",
//     message: "How can I help you?",
//     direction: "outbound",
//     timestamp: new Date().toISOString(),
//   });
// }

// async function handleButtonClick(userNumber, buttonId) {
//   console.log("Button clicked:", buttonId);

//   chatLogs(userNumber, {
//     from: userNumber,
//     type: "button",
//     message: buttonId,
//     direction: "inbound",
//     timestamp: new Date().toISOString(),
//   });

//   if (buttonId === "buy_product") {
//     await sendText(
//       userNumber,
//       "Great! We have these products: Phone, Laptop, Tablet."
//     );

//     chatLogs(userNumber, {
//       from: "bot",
//       type: "text",
//       message: "Great! We have these products: Phone, Laptop, Tablet.",
//       direction: "outbound",
//       timestamp: new Date().toISOString(),
//     });
//   } else if (buttonId === "service") {
//     await sendButton(userNumber, "Which service do you need?", [
//       { id: "mobile_service", title: "Mobile" },
//       { id: "laptop_service", title: "Laptop" },
//     ]);
//     chatLogs(userNumber, {
//       from: "bot",
//       type: "button",
//       message: "Which service do you need?",
//       direction: "outbound",
//       timestamp: new Date().toISOString(),
//     });
//   } else if (buttonId === "mobile_service") {
//     await sendText(
//       userNumber,
//       "You selected Mobile Service. Our team will contact you shortly."
//     );
//     chatLogs(userNumber, {
//       from: "bot",
//       type: "text",
//       message:
//         "You selected Mobile Service. Our team will contact you shortly.",
//       direction: "outbound",
//       timestamp: new Date().toISOString(),
//     });
//   } else if (buttonId === "laptop_service") {
//     await sendText(
//       userNumber,
//       "You selected Laptop Service. Our team will contact you shortly."
//     );
//     chatLogs(userNumber, {
//       from: "bot",
//       type: "text",
//       message:
//         "You selected Laptop Service. Our team will contact you shortly.",
//       direction: "outbound",
//       timestamp: new Date().toISOString(),
//     });
//   }
// }

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receive messages & button clicks
app.post("/webhook", async (req, res) => {
  // console.log("WEBHOOK BODY:", JSON.stringify(req.body, null, 2));

  const body = req.body;

  if (body.object) {
    const changes = body.entry[0].changes[0].value;
    const messages = changes.messages;

    if (messages && messages.length > 0) {
      const msg = messages[0];
      const from = msg.from;

      // console.log("Incoming message type:", msg.type);

      if (msg.type === "text") {
        await handleUserMessage(from, msg.text.body);
      }
      //    else if (msg.type === "interactive") {
      //     const interactiveType = msg.interactive.type;

      //     // if (interactiveType === "button_reply") {
      //     //   const buttonId = msg.interactive.button_reply.id;
      //     if (interactiveType === "button") {
      //       const buttonId = msg.button.payload;
      //       console.log("Template button clicked:", buttonId);
      //       await handleButtonClick(from, buttonId);
      //     }
      //   }
      // }
      else if (msg.type === "button") {
        const buttonId = msg.button.payload;
        // console.log("Template button clicked:", buttonId);
        await handleButtonClick(from, buttonId);
      } else if (msg.type === "interactive") {
        const interactiveType = msg.interactive.type;

        if (interactiveType === "button_reply") {
          const buttonId = msg.interactive.button_reply.id;
          // console.log("Interactive button clicked:", buttonId);
          await handleButtonClick(from, buttonId);
        } else if (interactiveType === "list_reply") {
          const listId = msg.interactive.list_reply.id;
          const listTitle = msg.interactive.list_reply.title;

          if (userSessions[from]) {
            const session = userSessions[from];

            if (session.step === 3) {
              session.data.brandName = listTitle;
              session.step = 4;
              await sendText(from, "What’s your *model name*?");
            } else if (session.step === 5) {
              session.data.issueType = listTitle;
              session.step = 6;
              await sendSlotList(from);
            } else if (session.step === 6) {
              session.data.slot = listTitle;
              session.step = 7;
              await sendText(from, "Please share your *location pin*");
            }
          }
        }
      } else if (msg.type === "location") {
        const { latitude, longitude, name, address } = msg.location;
        console.log(
          "User shared location:",
          latitude,
          longitude,
          name,
          address
        );

        if (userSessions[from]) {
          userSessions[from].data.location = {
            latitude,
            longitude,
            name,
            address,
          };
          userSessions[from].step = 7;
        }

        await handleFormFlow(from, "__LOCATION_RECEIVED__");
      } else {
        console.log("Unhandled message type:", msg.type);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get("/chats", (req, res) => {
  res.status(200).json({
    code: 200,
    status: "Success",
    userCount: Object.keys(userSessions).length,
    data: userSessions,
  });
});

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(200).json({
    code: 200,
    status: "Live",
    project: "WhatsApp API",
    developedBy: "https://github.com/Inasync-io",
  });
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


// import e from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import bodyParser from "body-parser";
// import router from "./routers/routes.js";

// const app = e();
// app.use(bodyParser.json());

// app.use("/", router);

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
