const router = require("express").Router();

const helpers = require("../helpers/logs");

// @route   api/logs
// @GET     Retrieves all Logs.
// @POST    Creates a new event.
// @access  public
router.route("/").get(helpers.getLogs).post(helpers.postLog);

// @route   api/logs/:id
// @DELETE  Deletes a log.
// @access  public
router.route("/:id").delete(helpers.deleteLog);

module.exports = router;
