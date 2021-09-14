const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

// Define the Task model.
const TaskSchema = new Schema({
	requestedAt: {
		type: Date,
	},
	status: {
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
		type: String,
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
});

TaskSchema.plugin(AutoIncrement, { inc_field: "taskId" });

// Export the Task model.
module.exports = Task = mongoose.model("task", TaskSchema);
