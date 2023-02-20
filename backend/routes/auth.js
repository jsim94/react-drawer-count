"use strict";

/** Routes for users and auth. */

const express = require("express");
const jsonschema = require("jsonschema");

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userSchema = require("../schemas/user.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/** POST /auth/token:  { username, password } => { token }
 *
 *  Password must be provided. null if user has no password
 *
 *  Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const username = req.body.username;
    const password = req.body.password || null;

    const user = await User.authenticate(username, password);

    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
