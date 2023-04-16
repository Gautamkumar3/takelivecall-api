const express = require("express");
const {
  getAllEvent,
  createEvent,
  sendRequestToJoin,
  organiserCheckRequest,
  getAllPlayersByAcceptedPlayer,
  findAllEventByUser,
  getSingleEvent,
  getSearchedResult,
  deleteAllPendingRequest,
} = require("../controller/event");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const EventRouter = express.Router();

EventRouter.get("/", getAllEvent);
EventRouter.get("/search", getSearchedResult);
EventRouter.get("/:id", getSingleEvent);
EventRouter.post("/create", AuthMiddleware, createEvent);
EventRouter.post("/request/:id", AuthMiddleware, sendRequestToJoin);
EventRouter.post(
  "/request/:eventId/:playerId",
  AuthMiddleware,
  organiserCheckRequest
);
EventRouter.get(
  "/allplayer/:eventId",
  AuthMiddleware,
  getAllPlayersByAcceptedPlayer
);
EventRouter.get("/user/alldata", AuthMiddleware, findAllEventByUser);

module.exports = EventRouter;
