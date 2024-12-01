const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
  {
    // avatar: String,
    // status: String,
    users: [
    ],
    position : {
      type : Number,
      default : 1
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;