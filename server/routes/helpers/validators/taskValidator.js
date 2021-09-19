const validator = require("validator");
const isEmpty = require("./is-empty");
const _ = require("lodash");

module.exports = function validateTaskInput(data) {
	// initialize errors
	let errors = {};

	data.enemyActivity = data.enemyActivity === "true";

	// Set data values to blanks if they're empty.
	data.requestedBy = !isEmpty(data.requestedBy) ? data.requestedBy : "";
	data.location = !isEmpty(data.location) ? data.location : "";
	data.precedence = !isEmpty(data.precedence) ? data.precedence : "";

	// Check to see if todo description has validation errors.
	if (validator.isEmpty(data.requestedBy)) {
		errors.requestedBy = "Requested by is required.";
	}
	if (validator.isEmpty(data.location)) {
		errors.location = "The location is required.";
	}
	if (validator.isEmpty(data.precedence)) {
		errors.precedence = "The precedence is required";
	}

	if (!_.isBoolean(data.enemyActivity)) {
		errors.enemyActivity = "Enemy activity must be true or false.";
	}

	if (data.items.length <= 0) {
		errors.items = "You must select items when entering the request.";
	}

	// Return errors and a property called isValid.
	return {
		errors,
		isValid: isEmpty(errors),
	};
};
