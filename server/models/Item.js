const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

// Define the Task model.
const ItemSchema = new Schema({
	icon: {
		type: String,
	},
	name: {
		type: String,
	},
	unitsPerCrate: {
		type: String,
	},
	bmatCost: {
		type: Number,
	},
	ematCost: {
		type: Number,
	},
	rmatCost: {
		type: Number,
	},
	hmatCost: {
		type: Number,
	},
	timeToCook: {
		type: Number,
	},
	faction: {
		type: String,
	},
	category: {
		type: String,
	},
});

// Export the Task model.
module.exports = Item = mongoose.model("item", ItemSchema);
