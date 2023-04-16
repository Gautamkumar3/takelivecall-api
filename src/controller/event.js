const EventModal = require("../modal/sportsEvent");

const createEvent = async (req, res) => {
  const user_id = req.userId;
  try {
    const eventData = new EventModal({ ...req.body, organizer: user_id });
    await eventData.save();
    return res.status(200).send({
      status: "success",
      message: "Event created successfully",
      data: eventData,
    });
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

const getAllEvent = async (req, res) => {
  try {
    const allEvent = await EventModal.find();
    return res.status(200).send({
      status: "success",
      messsage: "All events get successfully",
      data: allEvent,
    });
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

const getSingleEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await EventModal.findById(id);
    if (!event) {
      return res
        .status(404)
        .send({ status: "error", message: "Event not found" });
    } else {
      return res.status(200).send({
        status: "success",
        message: "Event get successfully",
        data: event,
      });
    }
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

// http://localhost:8080/event/request/64399ea141c2f9a96eafd3b9

const sendRequestToJoin = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.userId;
  const user_name = req.user_name;

  try {
    const event = await EventModal.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .send({ status: "error", message: "Event not found" });
    }

    if (event.players.length >= event.max_players) {
      return res
        .status(400)
        .send({ status: "error", message: "Event is full" });
    }

    const alreadyJoined = event.players.find((player) => {
      return player.user.toString() === userId;
    });

    if (alreadyJoined) {
      return res.status(400).send({
        status: "error",
        message: "User has already joined the event",
      });
    }

    const checkExpire = await EventModal.find({
      date: { $lte: new Date() },
      start_time: { $lte: new Date().getHours() },
    });

    if (checkExpire.length !== 0) {
      return res.status(404).send({
        status: "error",
        message: "This event is started you can't join this event.",
      });
    }

    event.players.push({ user: userId, status: "requested", name: user_name });
    await event.save();
    return res.status(200).send({
      status: "success",
      message: "Request send to the organizer",
      data: event,
    });
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

// here i have to send eventId and playersId from the params
//  http://localhost:8080/event/request/6439724dec232f19b009643c/64397f2ab848dfbb460f9475

const organiserCheckRequest = async (req, res) => {
  const { eventId, playerId } = req.params;
  const { status } = req.body;
  const userId = req.userId;
  try {
    if (!status) {
      return res
        .status(400)
        .send({ status: "error", message: "Please provide the status" });
    }

    const event = await EventModal.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .send({ status: "error", message: "Event not found" });
    }
    if (event.organizer.toString() !== userId) {
      return res.status(404).send({
        status: "error",
        message: "You are not an organizer of this event",
      });
    }
    const request = event.players.find(
      (player) => player._id.toString() === playerId
    );

    if (!request) {
      return res
        .status(404)
        .send({ status: "error", message: "Request not found" });
    }

    if (request.status === "accepted" || request.status === "rejected") {
      return res
        .status(400)
        .send({ status: "error", message: "Request already processed" });
    }

    const checkExpire = await EventModal.find({
      date: { $lte: new Date() },
      start_time: { $lte: new Date().getHours() },
    });

    if (checkExpire.length !== 0) {
      return res.status(404).send({
        status: "error",
        message: "This event is started you can't update status",
      });
    }

    request.status = status;
    await event.save();
    return res.status(200).send({
      status: "success",
      message: `Your request is ${status} by the orgainzer`,
      data: request,
    });
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

// http://localhost:8080/event/allplayer/64399ea141c2f9a96eafd3b9

const getAllPlayersByAcceptedPlayer = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await EventModal.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .send({ status: "error", message: "Event not found" });
    }

    const filteredData = event.players.filter(
      (player) => player.status === "accepted"
    );

    if (filteredData.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "Your are not joined in this event.",
      });
    } else {
      return res.status(200).send({
        status: "success",
        message: "All players data get successfully",
        data: filteredData,
      });
    }
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

const findAllEventByUser = async (req, res) => {
  const userId = req.userId;
  try {
    const allEvent = await EventModal.find({ "players.user": userId });
    return res.status(200).send({
      status: "success",
      messsage: "All data get successfully.",
      data: allEvent,
    });
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

const getSearchedResult = async (req, res) => {
  console.log(req.query);
  let keyword = {};
  if (req.query.q) {
    keyword = req.query.q;
  }

  try {
    const searchedEvent = await EventModal.find({
      sport_name: { $regex: keyword, $options: "i" },
    });

    return res.status(200).send({
      status: "success",
      messsage: "All data get successfully.",
      data: searchedEvent,
    });
  } catch (er) {
    return res
      .status(500)
      .send({ status: "error", message: er.message, a: "Sdata" });
  }
};

async function deleteAllPendingRequest() {
  await EventModal.updateMany(
    {
      date: { $lte: new Date() },
      start_time: { $lte: new Date().getHours() },
      "players.status": "requested",
    },
    {
      $pull: {
        players: {
          status: "requested",
        },
      },
    }
  );
}

setInterval(() => {
  deleteAllPendingRequest();
}, 300000);

module.exports = {
  createEvent,
  getAllEvent,
  getSingleEvent,
  sendRequestToJoin,
  organiserCheckRequest,
  getAllPlayersByAcceptedPlayer,
  findAllEventByUser,
  getSearchedResult,
};
