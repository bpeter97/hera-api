const _ = require("lodash");
const Event = require("../../models/Event");
const Member = require("../../models/Member");
const ObjectID = require("mongoose").Types.ObjectId;

// @route   GET api/events/
// @desc    Retrieves all events
// @access  Private
exports.getEvents = (req, res) => {
	Event.find({})
		.then((events) => {
			if (!events) {
				return res.json({ error: "No events found." });
			}
			res.json(events);
		})
		.catch((e) => res.status(404).json(e));
};

// @route   POST api/events/
// @desc    Creates a new event
// @access  Private
exports.postEvent = async (req, res) => {
	// add validation
	// const { errors, isValid } = validateEventInput(req.body);
	// if (!isValid) return res.status(400).json(errors);

	let data = {
		title: req.body.title,
		date: req.body.date,
		color: req.body.color,
		members: [],
	};

	let newEvent = new Event(data);

	newEvent
		.save()
		.then((event) => {
			if (!event) {
				console.log(chalk.red(`There was an issue creating a event.`));
				return res.json({
					error: "There was an issue saving the event.",
				});
			}

			io.emit("event-change", { change: "POST", event });
			res.send(event);
		})
		.catch((e) => console.log(e));
};

exports.patchEvent = async (req, res) => {
	let update = {
		title: req.body.title,
		date: req.body.date,
		color: req.body.color,
		members: req.body.members,
	};

	await Event.findOneAndUpdate({ _id: req.params.id }, update, {
		new: true,
	}).then((event) => {
		if (!event) {
			console.log(chalk.red(`There was an issue creating a event.`));
			return res.json({
				error: "There was an issue saving the event.",
			});
		}

		io.emit("event-change", { change: "PATCH", event });
		res.send(event);
	});
};

// @route	PATCH /api/events/register/:id
// @desc	Registers a user for an event
// @access 	Private
exports.registerEvent = async (req, res) => {
	let data = {
		id: req.body.id,
		user: req.body.user,
	};

	Member.findOne({ discordId: data.user })
		.then((user) => {
			if (!user)
				return res
					.status(400)
					.json("There was an issue finding the user.");
			Event.findById({ _id: data.id })
				.then((event) => {
					event.members.push({ member: user, status: "Registered" });
					let newEvent = new Event(event);

					newEvent
						.save()
						.then((event) => {
							if (!event)
								return res
									.status(400)
									.send(
										"There was an issue saving the event."
									);
							io.emit("event-change", {
								change: "REGISTER",
								event,
							});
							res.send(event);
						})
						.catch((e) => console.log(e));
				})
				.catch((e) => console.log(e));
		})
		.catch((e) => console.log(e));
};
