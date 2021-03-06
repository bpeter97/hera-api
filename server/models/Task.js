const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

// Define the Task model.
const TaskSchema = new Schema({
	requestedBy: {
		type: String,
	},
	requestedAt: {
		type: String,
	},
	status: {
		type: String,
	},
	region: {
		type: String,
	},
	logiStatus: {
		type: String,
	},
	location: {
		type: String,
	},
	precedence: {
		type: String,
	},
	enemyActivity: {
		type: Boolean,
	},
	items: {
		type: Array,
	},
	assignedTo: {
		type: Array,
	},
	completedAt: {
		type: Date,
	},
	type: {
		type: String,
	},
});

TaskSchema.plugin(AutoIncrement, { inc_field: "taskId" });

// Export the Task model.
module.exports = Task = mongoose.model("task", TaskSchema);
