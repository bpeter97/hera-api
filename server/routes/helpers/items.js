const _ = require("lodash");
const Item = require("../../models/Item");
const ObjectID = require("mongoose").Types.ObjectId;

// @route   GET api/items/
// @desc    Retrieves all items
// @access  Private
exports.getItems = (req, res) => {
	Item.find({})
		.then((items) => {
			if (!items) {
				return res.json({ error: "No items found." });
			}
			res.send(items);
		})
		.catch((e) => res.status(404).json(e));
};
