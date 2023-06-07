"use strict";

/** Express app for drawer count. */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/history");
const userRoutes = require("./routes/user");

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);

app.get("/api", async (req, res, next) => {
  return res.status(200).json({ status: "ok" });
});

/** Handle 404 errors -- this matches everything */
app.use((req, res, next) => {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  if (status === 500) console.error(err);

  return res.status(status).json({
    error: message,
    status,
  });
});

module.exports = app;
