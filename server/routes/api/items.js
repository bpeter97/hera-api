const router = require("express").Router();

const helpers = require("../helpers/items");

// @route   api/items
// @GET     Retrieves all items.
// @access  public
router.route("/").get(helpers.getItems);

// @route   api/items/:faction
// @GET     Retrieves all items for a faction.
// @access  public
router.route("/:faction").get(helpers.getFactionItems);

module.exports = router;
