const router = require("express").Router();

const helpers = require("../helpers/tasks");

// @route   api/tasks
// @GET     Retrieves all Tasks.
// @POST    Creates a new Task.
// @access  public
router.route("/").get(helpers.getTasks).post(helpers.postTask);

// @route   api/tasks/:id
// @DELETE  Deletes all tasks.
// @PATCH  	Updates a task.
// @GET  	Retrieves a task.
// @access  public
router
	.route("/:id")
	.delete(helpers.deleteTask)
	.get(helpers.getTask)
	.patch(helpers.patchTask);

module.exports = router;
