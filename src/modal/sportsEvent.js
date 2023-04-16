const mongoose = require("mongoose");

const sportsEventSchema = new mongoose.Schema({
  sport_name: {
    type: String,
    required: [true, "Please provide name of the sports"],
  },
  description: {
    type: String,
    required: [true, "Please provide the event description"],
  },
  date: {
    type: Date,
    required: [true, "Please provide the event date"],
  },
  start_time: {
    type: String,
    required: [true, "Please provide the event start time"],
  },
  max_players: {
    type: Number,
    required: [true, "Please provide the number of players for this event."],
  },
  location: {
    type: String,
    required: [true, "Please provide the event location"],
  },

  players: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      status: {
        type: String,
        enum: ["requested", "accepted", "rejected"],
        default: "requested",
      },
      name: {
        type: String,
      },
    },
  ],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Event = mongoose.model("event", sportsEventSchema);
module.exports = Event;
