"use strict";

/** Routes for basic app functions. */

const express = require("express");
const jsonschema = require("jsonschema");

const History = require("../models/history");
const submissionSchema = require("../schemas/submission.json");
const addNoteSchema = require("../schemas/addNote.json");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { parseHistory } = require("../helpers/parseHistory");

const router = new express.Router();

/** Middleware to use when user must match history or be admin
 *
 * If not, raises Unauthorized.
 */

async function ensureSameUserOrAdmin(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    if (res.locals.user.isAdmin) return next();

    const userCheck = await History.getById(req.params.id);

    if (userCheck.username !== res.locals.user.username)
      throw new UnauthorizedError();

    return next();
  } catch (err) {
    return next(err);
  }
}

/** POST /submit { currencyCode, drawerAmount, denominations }
 *
 *  Authorization required: logged in
 */

router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, submissionSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const submission = await History.create(res.locals.user.username, req.body);

    const calculatedSubmission = parseHistory(submission);

    return res.status(201).json({ submission: calculatedSubmission });
  } catch (err) {
    return next(err);
  }
});

/** GET /user/:username returns all users history
 *
 *  Returns [{ id, createdAt, historyColor }]
 *
 *  Authorization required: correct user
 */

router.get("/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const submissions = await History.getUserHistory(req.params.username);

    return res.json({ submissions });
  } catch (err) {
    return next(err);
  }
});

/** GET /user returns all users history
 *
 *  Returns [{ id, createdAt, historyColor }]
 *
 *  Authorization required: logged in
 */

router.get("/user", ensureLoggedIn, async (req, res, next) => {
  try {
    const submissions = await History.getUserHistory(res.locals.user.username);
    return res.json({ submissions });
  } catch (err) {
    return next(err);
  }
});

/** GET /:id
 *
 *  Authorization required: matching user or admin
 */

router.get("/:id", ensureSameUserOrAdmin, async (req, res, next) => {
  try {
    const submission = await History.getById(req.params.id);

    const calculatedSubmission = parseHistory(submission);

    return res.json({ submission: calculatedSubmission });
  } catch (err) {
    return next(err);
  }
});

/** GET /schema/:schemaName
 *
 *  Authorization required: none
 */

router.get("/schema/:schemaName", ensureLoggedIn, async (req, res, next) => {
  try {
    const schema = await History.getSchema(req.params.schemaName);
    return res.json(schema);
  } catch (err) {
    return next(err);
  }
});

/** PUT /add-note { id, note }
 *
 *  Authorization required: same user
 */

router.put("/:id/add-note", ensureSameUserOrAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, addNoteSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const userCheck = await History.getById(req.params.id);

    if (userCheck.username !== res.locals.user.username)
      throw new UnauthorizedError();

    const submission = await History.addNote(req.params.id, req.body.note);

    return res.json({ submission });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /:id/delete
 *
 *  Authorization required: same user
 */

router.delete("/:id/delete", ensureSameUserOrAdmin, async (req, res, next) => {
  try {
    return res.json(await History.delete(req.params.id));
  } catch (err) {
    return next(err);
  }
});

/** DELETE /user
 *
 *  Authorization required: same user
 */

router.delete("/user", ensureLoggedIn, async (req, res, next) => {
  try {
    const username = res.locals.user.username;
    return res.json(await History.deleteUserHistory(username));
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
