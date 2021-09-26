const _ = require("lodash");
const Task = require("../../models/Task");
const Member = require("../../models/Member");
const ObjectID = require("mongoose").Types.ObjectId;
const axios = require("axios");
const chalk = require("chalk");

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

	let items = req.body.items.map((item) => {
		return {
			item: item.item,
			quantity: parseInt(item.quantity),
			type: item.type,
		};
	});

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
		items: items,
		assignedTo: [],
		completedAt: null,
		type: req.body.type,
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

			Member.findOne({ username: task.requestedBy }).then((member) => {
				if (!member) {
					return res.json({ error: "There was no member found" });
				}

				sendObj = {
					discordId: member.discordId,
					requestId: task.taskId,
					logiStatus: task.logiStatus,
					assignedTo: task.assignedTo,
					updateType: "new",
				};

				if (process.env.NODE_ENV !== "development") {
					axios.post(
						"https://hera-discord.herokuapp.com/newEvent",
						sendObj
					);
				}

				io.emit("task-change", { change: "POST", task });
				res.send(task);
			});
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
		type: req.body.type,
	};

	await Task.findByIdAndUpdate(req.params.id, update)
		.then((task) => {
			if (!task) {
				return res.json({ error: "No task was found." });
			}

			Member.findOne({ username: task.requestedBy })
				.then((member) => {
					if (!member) {
						return res.json({ error: "There was no member found" });
					}

					let sendObj = {};

					if (update.status !== task.status) {
						sendObj = {
							discordId: member.discordId,
							requestId: task.taskId,
							logiStatus: update.status,
							assignedTo: req.body.assignedTo,
							updateType: "update",
						};

						if (process.env.NODE_ENV !== "development") {
							axios.post(
								"https://hera-discord.herokuapp.com/newEvent",
								sendObj
							);
						}
					} else if (update.logiStatus !== task.logiStatus) {
						if (
							update.logiStatus === "Delivering" &&
							update.enemyActivity === true
						) {
							var assignedToIds = [];

							var getAssignedIds = new Promise(
								(resolve, reject) => {
									update.assignedTo.forEach(
										(person, index, array) => {
											Member.findOne({
												username: person,
											}).then((assignee) => {
												assignedToIds.push(
													assignee.discordId
												);
											});
											if (index === array.length - 1)
												resolve();
										}
									);
								}
							);

							setTimeout(() => {
								getAssignedIds.then(() => {
									sendObj = {
										discordId: member.discordId,
										requestId: task.taskId,
										logiStatus: update.logiStatus,
										assignedTo: assignedToIds[0],
										updateType: "antiPartisan",
									};

									if (
										process.env.NODE_ENV !== "development"
									) {
										axios.post(
											"https://hera-discord.herokuapp.com/newEvent",
											sendObj
										);
									}
								});
							}, 1500);
						} else {
							sendObj = {
								discordId: member.discordId,
								requestId: task.taskId,
								logiStatus: update.logiStatus,
								assignedTo: req.body.assignedTo,
								updateType: "update",
							};

							if (process.env.NODE_ENV !== "development") {
								axios.post(
									"https://hera-discord.herokuapp.com/newEvent",
									sendObj
								);
							}
						}
					}

					Task.findById({ _id: task._id }).then((task) => {
						io.emit("task-change", { change: "PATCH", task });
						res.send(task);
					});
				})
				.catch((e) => res.status(404).json(e));
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

			Member.findOne({ username: task.requestedBy })
				.then((member) => {
					if (!member) {
						return res.json({ error: "There was no member found" });
					}

					let sendObj = {
						discordId: member.discordId,
						requestId: task.taskId,
						logiStatus: task.status,
						updateType: "delete",
					};

					if (process.env.NODE_ENV !== "development") {
						axios.post(
							"https://hera-discord.herokuapp.com/newEvent",
							sendObj
						);
					}

					io.emit("task-change", { change: "DELETE", task });
					res.send(task);
				})
				.catch((e) => res.status(404).json(e));
		})
		.catch((e) => res.status(404).json(e));
};
