const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Event model.
const EventSchema = new Schema({
	title: {
		type: String,
	},
	date: {
		type: String,
	},
	color: {
		type: String,
	},
	members: [],
});

// Export the Event model.
module.exports = Event = mongoose.model("event", EventSchema);
