"use strict";

/** Routes for users and auth. */

const express = require("express");
const jsonschema = require("jsonschema");

const User = require("../models/user");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/** GET /user:  { username } => { user }
 *
 * Returns { username, password(bool), defaultCurency, defaultAmount }
 *
 * Authorization required: none
 */

router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { username, password, defaultCurency, defaultAmount }
 *
 * Returns { username, password(bool), defaultCurency, defaultAmount }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.patch(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
