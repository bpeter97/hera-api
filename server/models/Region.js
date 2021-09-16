const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Task model.
const RegionSchema = new Schema({
	icon: {
		type: String,
	},
	name: {
		type: String,
	},
});

// Export the Task model.
module.exports = Region = mongoose.model("region", RegionSchema);
