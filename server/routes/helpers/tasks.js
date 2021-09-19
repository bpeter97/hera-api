const _ = require("lodash");
const Task = require("../../models/Task");
const ObjectID = require("mongoose").Types.ObjectId;

// validation files
const validateTaskInput = require("./validators/taskValidator");

// @route   GET api/tasks/
// @desc    Retrieves all tasks
// @access  Private
exports.getTasks = (req, res) => {
	Task.find({})
		.then((tasks) => {
			if (!tasks) {
				return res.json({ error: "No tasks found." });
			}
			res.send(tasks);
		})
		.catch((e) => res.status(404).json(e));
};

// @route   GET api/tasks/:id
// @desc    Retrieves a task
// @access  Private
exports.getTask = async (req, res) => {
	let errors = {};

	if (!ObjectID.isValid(req.params.id)) {
		let id = parseInt(req.params.id);

		if (typeof id === "string" || id instanceof String) {
			errors.task = "There was no task found";
			return res.status(400).json(errors);
		}
		if (!Number.isInteger(id)) {
			errors.task = "There was no task found";
			return res.status(400).json(errors);
		}

		Task.findOne({ taskId: id })
			.then((task) => {
				if (!task) {
					return res.json({ error: "There was no task found" });
				}
				res.send(task);
			})
			.catch((e) => res.status(404).json(e));
	} else {
		Task.findById(req.params.id)
			.then((task) => {
				if (!task) {
					return res.json({ error: "There was no task found" });
				}
				res.send(task);
			})
			.catch((e) => res.status(404).json(e));
	}
};

// @route   POST api/tasks/
// @desc    Creates a new task
// @access  Private
exports.postTask = async (req, res) => {
	// Fetch validation errors.
	const { errors, isValid } = validateTaskInput(req.body);

	// send 400 error with validation errors if not valid.
	if (!isValid) return res.status(400).json(errors);

	let data = {
		requestedBy: req.body.requestedBy,
		requestedAt: new Date(),
		status: "Pending",
		region: req.body.region,
		logiStatus: "Pending",
		location: req.body.location,
		precedence: req.body.precedence,
		enemyActivity: req.body.enemyActivity,
		items: req.body.items,
		assignedTo: [],
		completedAt: null,
	};

	let newTask = new Task(data);

	newTask
		.save()
		.then((task) => {
			if (!task) {
				return res.json({
					error: "There was an issue saving the task.",
				});
			}

			io.emit("task-change", { change: "POST", task });
			res.send(task);
		})
		.catch((e) => console.log(e));
};

// @route   PATCH api/tasks/:id
// @desc    Updates a task
// @access  Private
exports.patchTask = async (req, res) => {
	let errors = {};

	if (!ObjectID.isValid(req.params.id)) {
		errors.task = "There was no task found";
		return res.status(400).json(errors);
	}

	let update = {
		requestedBy: req.body.requestedBy,
		requestedAt: req.body.requestedAt,
		status: req.body.status,
		region: req.body.region,
		logiStatus: req.body.logiStatus,
		location: req.body.location,
		precedence: req.body.precedence,
		enemyActivity: req.body.enemyActivity,
		items: req.body.items,
		assignedTo: req.body.assignedTo,
		completedAt: req.body.completedAt,
	};

	Task.findByIdAndUpdate(req.params.id, update, { new: true })
		.then((task) => {
			if (!task) {
				return res.json({ error: "No task was found." });
			}
			io.emit("task-change", { change: "PATCH", task });
			res.send(task);
		})
		.catch((e) => res.status(404).json(e));
};

// @route   DELETE api/tasks/
// @desc    Deletes a task
// @access  Private
exports.deleteTask = async (req, res) => {
	let errors = {};

	// Check ID
	if (!ObjectID.isValid(req.params.id)) {
		errors.task = "There was no task found";
		return res.status(400).json(errors);
	}

	Task.findByIdAndRemove(req.params.id)
		.then((task) => {
			if (!task) {
				errors.task = "There was no task found";
				res.status(404).json(errors);
			}
			io.emit("task-change", { change: "DELETE", task });
			res.send(task);
		})
		.catch((e) => res.status(404).json(e));
};
