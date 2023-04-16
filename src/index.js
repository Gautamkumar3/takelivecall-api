const express = require("express");
const dbConnect = require("./config/db");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const userRouter = require("./route/user");

const cors = require("cors");
const EventRouter = require("./route/event");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/event", EventRouter)

app.get("/", (req, res) => {
  res.send("Welcome to Takelivecall");
});

app.listen(PORT, async (req, res) => {
  await dbConnect();
  console.log(`Server is running on port ${PORT}`);
});
