import e from "express";
import {
  handleButtonClick,
  handleUserMessage,
} from "../Controllers/whatsappCon.js";

const router = e.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    code: 200,
    status: "Live",
    project: "WhatsApp API",
    developedBy: "https://github.com/Inasync-io",
  });
});

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("VERIFY_TOKEN (from .env):", process.env.VERIFY_TOKEN);

  if (mode && token && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const changes = body.entry[0].changes[0].value;
    const messages = changes.messages;

    if (messages && messages.length > 0) {
      const msg = messages[0];
      const from = msg.from;

      if (msg.type === "text") {
        await handleUserMessage(from, msg.text.body);
      } else if (msg.type === "interactive") {
        const interactiveType = msg.interactive.type;

        if (interactiveType === "button_reply") {
          const buttonId = msg.interactive.button_reply.id;
          await handleButtonClick(from, buttonId);
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default router;
