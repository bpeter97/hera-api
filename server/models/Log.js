const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Task model.
const LogSchema = new Schema({
	message: {
		type: String,
	},
	member: {
		type: String,
	},
	date: {
		type: Date,
	},
});

// Export the Task model.
module.exports = Log = mongoose.model("log", LogSchema);
