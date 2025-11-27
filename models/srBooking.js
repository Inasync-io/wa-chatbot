import mongoose from "mongoose";

const srBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    issueType: {
      type: String,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    userNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const SrBooking = mongoose.model("SrBooking", srBookingSchema);
