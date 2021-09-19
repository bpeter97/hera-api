const _ = require("lodash");
const Region = require("../../models/Region");

// @route   GET api/regions/
// @desc    Retrieves all regions
// @access  Private
exports.getRegions = (req, res) => {
	Region.find({})
		.sort({ name: 1 })
		.then((regions) => {
			if (!regions) {
				return res.json({ error: "No regions found." });
			}
			res.send(regions);
		})
		.catch((e) => res.status(404).json(e));
};
