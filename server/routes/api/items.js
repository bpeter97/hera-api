const router = require("express").Router();

const helpers = require("../helpers/items");

// @route   api/items
// @GET     Retrieves all items.
// @access  public
router.route("/").get(helpers.getItems);

module.exports = router;
