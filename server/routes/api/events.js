const router = require("express").Router();

const helpers = require("../helpers/events");

// @route   api/events
// @GET     Retrieves all events.
// @POST    Creates a new event.
// @access  public
router.route("/").get(helpers.getEvents).post(helpers.postEvent);

// @route   api/events/:id
// @DELETE  Deletes all events.
// @PATCH  	Updates a Event.
// @GET  	Retrieves a Event.
// @access  public
router.route("/:id").patch(helpers.patchEvent);
router.route("/register/:id").patch(helpers.registerEvent);

module.exports = router;
