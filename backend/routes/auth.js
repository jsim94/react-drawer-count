"use strict";

/** Routes for users and auth. */

const express = require("express");
const jsonschema = require("jsonschema");

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userRegisterSchema = require("../schemas/userRegister.json");
const userLoginSchema = require("../schemas/userLogin.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/** POST /auth/check:   { user } => { found, password }
 *
 * user must include { username }
 *
 * Returns { "found", "password"} or 404
 *
 * Authorization required: none
 */

router.post("/check", async (req, res, next) => {
  try {
    const userResponse = await User.checkUser(req.body.username);

    return res.status(200).json(userResponse);
  } catch (err) {
    return next(err);
  }
});

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
    const validator = jsonschema.validate(req.body, userLoginSchema);
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
 * user must include { username, password }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
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
