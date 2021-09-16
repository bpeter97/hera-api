const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Task model.
const MemberSchema = new Schema({
	username: {
		type: String,
	},
	discordId: {
		type: String,
	},
	roles: {
		type: Array,
	},
});

// Export the Task model.
module.exports = Member = mongoose.model("member", MemberSchema);