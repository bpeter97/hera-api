const router = require("express").Router();

const helpers = require("../helpers/regions");

// @route   api/regions
// @GET     Retrieves all regions.
// @DATA	[{ name: "Region Name", icon: "Filename" },{ name: "Region Name2", icon: "Filename2" }]
// @access  public
router.route("/").get(helpers.getRegions);

module.exports = router;
