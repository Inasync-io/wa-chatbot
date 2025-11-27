import { SrBooking } from "../models/srBooking.js";
import axios from "axios";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

const { ACCESS_TOKEN, PHONE_NUMBER_ID } = process.env;

// const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
// const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

export const userSessions = {};

export async function sendText(to, message) {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
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

export async function sendIntro(to) {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "service_intro",
          language: { code: "en_US" },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: "https://www.w3schools.com/w3images/lights.jpg",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Template message sent successfully:", res.data);
  } catch (error) {
    console.error(
      "Error sending intro template:",
      error.response ? error.response.data : error.message
    );
  }
}

export async function handleUserMessage(userNumber, message) {
  console.log(`Incoming message from ${userNumber}: ${message}`);
  message = message.trim();

  if (/^(hi|hello)$/i.test(message)) {
    // await sendIntro(userNumber);

    await sendText(
      userNumber,
      "Hi there! Thanks for contacting our Service Center."
    );
    userSessions[userNumber] = { step: 1, data: {} };
    await sendText(userNumber, "Let's get your booking started!");
    await sendText(userNumber, "What’s your full name?");
    return;
  }

  if (userSessions[userNumber]) {
    await handleFormFlow(userNumber, message);
    return;
  }

  await sendText(userNumber, "Please type *hi* to start booking your service.");
}

export async function sendBrandList(to) {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Brand Selection",
          },
          body: {
            text: "Please choose your brand name from the list below:",
          },
          footer: {
            text: "Select one option to continue.",
          },
          action: {
            button: "Choose Brand",
            sections: [
              {
                title: "Available Brands",
                rows: [
                  {
                    id: "machcity",
                    title: "Mach City",
                    // description: "Track and Trail Cycle",
                  },
                  {
                    id: "bsa",
                    title: "BSA",
                    // description: "BSA Cycles",
                  },
                  {
                    id: "hercules",
                    title: "Hercules",
                    // description: "Hercules Cycles",
                  },
                  {
                    id: "brand_montra",
                    title: "Montra",
                    // description: "Montra Cycles",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Brand list sent:", res.data);
  } catch (err) {
    console.error(
      "Error sending brand list:",
      err.response?.data || err.message
    );
  }
}

export async function sendIssueTypes(to) {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Select your issue type?",
          },
          body: {
            text: "Please choose your issue type from the list below:",
          },
          footer: {
            text: "Select one option to continue.",
          },
          action: {
            button: "Choose Issue Type",
            sections: [
              {
                title: "Type of Issues",
                rows: [
                  {
                    id: "frame",
                    title: "Frame",
                  },
                  {
                    id: "rim",
                    title: "Rim",
                  },
                  {
                    id: "tyre",
                    title: "Tyre",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Issue list sent:", res.data);
  } catch (err) {
    console.error(
      "Error sending issue list:",
      err.response?.data || err.message
    );
  }
}

export async function sendSlotList(to) {
  try {
    const futureDate = dayjs().add(2, "day");
    const formattedDate = futureDate.format("DD MMM"); // Example: "14 Nov"

    const slots = [
      { id: "slot_1", title: `${formattedDate} - 10 AM to 11 AM` },
      { id: "slot_2", title: `${formattedDate} - 11 AM to 12 PM` },
      { id: "slot_3", title: `${formattedDate} - 02 PM to 03 PM` },
      { id: "slot_4", title: `${formattedDate} - 04 PM to 05 PM` },
    ];

    const res = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Slots Selection",
          },
          body: {
            text: `Please choose your slot for **${formattedDate}**`,
          },
          footer: {
            text: "Select one option to continue.",
          },
          action: {
            button: "Choose Slots",
            sections: [
              {
                title: "Available Slots",
                rows: slots,
                // rows: [
                //   {
                //     id: "slot_1",
                //     title: "12 Nov - 10 AM to 11 AM",
                //   },
                //   {
                //     id: "slot_2",
                //     title: "12 Nov - 11 AM to 12 PM",
                //   },
                //   {
                //     id: "slot_3",
                //     title: "12 Nov - 02 PM to 03 PM",
                //   },
                //   {
                //     id: "slot_4",
                //     title: "12 Nov - 04 PM to 05 PM",
                //   },
                // ],
              },
            ],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("slot list sent:", res.data);
  } catch (err) {
    console.error(
      "Error sending slot list:",
      err.response?.data || err.message
    );
  }
}

export async function handleButtonClick(userNumber, buttonId) {
  console.log("User clicked:", buttonId);

  // if (buttonId === "Book via WhatsApp") {
  //   userSessions[userNumber] = { step: 1, data: {} };
  //   await sendText(userNumber, "Let's get your booking started!");
  //   await sendText(userNumber, "What’s your full name?");
  // }
}

export async function handleFormFlow(userNumber, userResponse) {
  const session = userSessions[userNumber];
  if (!session) {
    await sendText(
      userNumber,
      "Please click *Book via WhatsApp* to start again."
    );
    return;
  }

  if (/^(cancel|stop|exit)$/i.test(userResponse.trim())) {
    delete userSessions[userNumber];
    await sendText(
      userNumber,
      "Your booking has been cancelled. You can type *Book via WhatsApp* to start again anytime."
    );
    return;
  }

  const { step } = session;

  switch (step) {
    case 1:
      session.data.name = userResponse.trim();
      session.step = 2;
      await sendText(userNumber, "Got it! Please share your *email address*.");
      break;

    case 2:
      session.data.email = userResponse.trim();
      session.step = 3;
      await sendBrandList(userNumber);
      break;

    // case 3:
    //   session.data.brandName = userResponse.trim();
    //   session.step = 4;
    //   await sendText(userNumber, "What’s your *model name*?");
    //   break;

    case 4:
      session.data.modelName = userResponse.trim();
      session.step = 5;
      await sendIssueTypes(userNumber);
      break;

    case 7:
      if (userResponse === "__LOCATION_RECEIVED__") {
        session.step = 8;
        await sendText(
          userNumber,
          `Here’s your booking summary:\n\n` +
            `Name: ${session.data.name}\n` +
            `Email: ${session.data.email}\n` +
            `Brand: ${session.data.brandName}\n` +
            `Model: ${session.data.modelName}\n` +
            `Issue: ${session.data.issueType}\n` +
            `Slot: ${session.data.slot}\n` +
            `Location: ${session.data.location?.address || "Received"}\n\n` +
            `Please reply with *confirm* to submit or *cancel* to stop.`
        );
      } else {
        await sendText(
          userNumber,
          "Waiting for your location.\nPlease share your location using the attach icon."
        );
      }
      break;

    case 8:
      if (/^(confirm|yes)$/i.test(userResponse.trim())) {
        try {
          const response = await axios.post(
            "http://localhost:5000/service-requests",
            {
              name: session.data.name,
              email: session.data.email,
              brandName: session.data.brandName,
              modelName: session.data.modelName,
              issueType: session.data.issueType,
              slot: session.data.slot,
              location: session.data.location,
              userNumber: userNumber,
            }
          );

          await sendText(
            userNumber,
            "Your booking has been submitted successfully! Our team will contact you soon."
          );

          console.log("Booking saved to API:", response.data);
        } catch (error) {
          console.error("Error saving booking:", error);
          await sendText(
            userNumber,
            "Something went wrong while submitting your booking. Please try again later."
          );
        }

        delete userSessions[userNumber];
      } else if (/^(cancel|no)$/i.test(userResponse.trim())) {
        await sendText(
          userNumber,
          "Booking cancelled. You can type *Book via WhatsApp* to start again anytime."
        );
        delete userSessions[userNumber];
      } else {
        await sendText(
          userNumber,
          "Please reply with *confirm* to submit or *cancel* to stop."
        );
      }
      break;

    default:
      await sendText(
        userNumber,
        "Please click *Book via WhatsApp* to start again."
      );
      delete userSessions[userNumber];
  }
}

export const serviceRequests = async (req, res) => {
  try {
    const {
      name,
      email,
      brandName,
      modelName,
      issueType,
      slot,
      location,
      userNumber,
    } = req.body;
    const newBooking = await SrBooking.create({
      name,
      email,    
      brandName,
      modelName,
      issueType,
      slot,
      location,
      userNumber,
    }); 

    await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "Service request created successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error creating service request:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
