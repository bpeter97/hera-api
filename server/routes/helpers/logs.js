const _ = require("lodash");
const Log = require("../../models/Log");
const Member = require("../../models/Member");

// @route   GET api/logs/
// @desc    Retrieves all logs
// @access  Private
exports.getLogs = async (req, res) => {
	Log.find({})
		.populate("member")
		.then((logs) => {
			if (!logs) {
				return res.json({ error: "No logs found." });
			}

			res.send(logs);
		})
		.catch((e) => res.status(404).json(e));
};

// @route   POST api/logs/
// @desc    Creates a log
// @access  Private
exports.postLog = (req, res) => {
	// Set the properties for the new Call
	var body = _.pick(req.body, ["message", "member"]);

	body.date = new Date();

	// Create the new Call
	var newLog = new Log(body);

	// Save the new Log to the DB, lastly return the Log.
	newLog
		.save()
		.then((log) => {
			if (!log) {
				return res.json({
					error: "There was an issue saving the log.",
				});
			}
			res.send(log);
		})
		.catch((e) => res.status(400).json(e));
};

// @route   DELETE api/logs/:id
// @desc    Deletes a log
// @access  Private
exports.deleteLog = async (req, res) => {
	Log.findByIdAndRemove(req.params.id)
		.then((log) => {
			if (!log) {
				return res.json({
					error: "There was an issue deleting the log.",
				});
			}

			res.send(log);
		})
		.catch((e) => res.status(404).json(e));
};
