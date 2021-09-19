const _ = require("lodash");
const Item = require("../../models/Item");
const ObjectID = require("mongoose").Types.ObjectId;

// @route   GET api/items/
// @desc    Retrieves all items
// @access  Private
exports.getItems = (req, res) => {
	Item.find({})
		.sort({ name: 1 })
		.then((items) => {
			if (!items) {
				return res.json({ error: "No items found." });
			}
			res.send(items);
		})
		.catch((e) => res.status(404).json(e));
};

// @route   GET api/items/:faction
// @desc    Retrieves all items for a specific faction (this includes neutral faction in the faction searched)
// @access  Private
exports.getFactionItems = (req, res) => {
	let param = (faction) => {
		return faction.charAt(0).toUpperCase() + faction.slice(1);
	};

	Item.find({ faction: { $in: [param(req.params.faction), "Neutral"] } })
		.sort({ name: 1 })
		.then((items) => {
			if (!items) {
				return res.json({ error: "No items found." });
			}
			res.send(items);
		})
		.catch((e) => res.status(404).json(e));
};
