import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

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

// export async function sendIntro(to) {
//   try {
//     const res = await axios.post(
//       `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to,
//         type: "interactive",
//         interactive: {
//           // type: "cta_url",
//           type: "button",
//           header: {
//             type: "image",
//             image: {
//               link: "https://www.w3schools.com/w3images/lights.jpg",
//             },
//           },
//           body: {
//             text: "Hello! Welcome to our Service Center.\n\nBook your service ticket online or continue via WhatsApp.",
//           },
//           footer: {
//             text: "Expert Care • Fast Booking",
//           },
//           action: {
//             // name: "cta_url",
//             // parameters: {
//             //   display_text: "Book Ticket Online",
//             //   url: "https://github.com/Inasync-io",
//             // },
//             buttons: [
//               // {
//               //   name: "cta_url",
//               //   parameters: {
//               //     display_text: "Book Ticket Online",
//               //     url: "https://github.com/Inasync-io",
//               //   },
//               // },
//               {
//                 type: "reply",
//                 reply: {
//                   id: "book_via_whatsapp",
//                   title: "Book via WhatsApp",
//                 },
//               },
//             ],
//           },
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Intro card sent:", res.data);
//   } catch (error) {
//     console.error(
//       "Error sending intro card:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

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
    await sendIntro(userNumber);

    // await sendText(
    //   userNumber,
    //   "Hi there! Thanks for contacting our Service Center."
    // );
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
                    id: "trackandtrail",
                    title: "Track and Trail",
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
            text: "Please choose your slots from the list below:",
          },
          footer: {
            text: "Select three option to continue.",
          },
          action: {
            button: "Choose Slots",
            sections: [
              {
                title: "Available Slots",
                rows: [
                  {
                    id: "slot_1",
                    title: "12 Nov - 10 AM to 11 AM",
                  },
                  {
                    id: "slot_2",
                    title: "12 Nov - 11 AM to 12 PM",
                  },
                  {
                    id: "slot_3",
                    title: "12 Nov - 02 PM to 03 PM",
                  },
                  {
                    id: "slot_4",
                    title: "12 Nov - 04 PM to 05 PM",
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

  if (buttonId === "Book via WhatsApp") {
    userSessions[userNumber] = { step: 1, data: {} };
    await sendText(userNumber, "Let's get your booking started!");
    await sendText(userNumber, "What’s your full name?");
  }
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
            "https://your-api-endpoint.com/api/bookings",
            {
              name: session.data.name,
              email: session.data.email,
              brandName: session.data.brandName,
              modelName: session.data.modelName,
              issueType: session.data.issueType,
              slot: session.data.slot,
              location: session.data.location,
              userNumber: session.data.userNumber,
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

// export async function sendButton(to, text, buttons) {
//   const formattedButtons = buttons.map((btn) => ({
//     type: "reply",
//     reply: { id: btn.id, title: btn.title },
//   }));
//   try {
//     const res = await axios.post(
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
//     console.log("Button sent:", res.data);

//   } catch (error) {
//     console.error(
//       "Error sending button:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// export async function sendText(to, text) {
//   try {
//     const res = await axios.post(
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
//     console.log("Text sent:", res.data);
//   } catch (error) {
//     console.error(
//       "Error sending text:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// // ------------------- Flow Logic -------------------
// export async function handleUserMessage(userNumber, message) {
//   await sendButton(userNumber, "How can i help you?", [
//     { id: "buy_product", title: "Buy Product" },
//     { id: "talk_human", title: "Talk to Human" },
//     { id: "service", title: "Services" },
//   ]);
// }

// export async function handleButtonClick(userNumber, buttonId) {
//     if (buttonId === "buy_product") {
//       await sendText(userNumber, "Great! What product are you interested in?");
//     } else if (buttonId === "service") {
//         await sendButton(userNumber, "Choose a service:", [
//           { id: "mobile_service", title: "Mobile" },
//           { id: "internet_service", title: "Internet" },
//           { id: "tv_service", title: "TV" },
//         ])
//     } else if (buttonId === "mobile_service") {
//         await sendText(userNumber, "You selected Mobile Service. Our team will contact you shortly.");
//     } else if (buttonId === 'internet_service') {
//         await sendText(userNumber, 'You selected Internet Service. Our team will contact you shortly.');
//     } else if (buttonId === 'tv_service') {
//         await sendText(userNumber, 'You selected TV Service. Our team will contact you shortly.');
//     } else if (buttonId === "talk_human") {
//         await sendText(userNumber, "Please wait while we connect you to a human agent.");
//     } else {
//       await sendText(userNumber, "Sorry, I didn't understand that selection.");
//     }
// }
