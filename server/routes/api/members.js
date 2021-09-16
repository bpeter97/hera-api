const router = require("express").Router();

const helpers = require("../helpers/members");

// @route   api/members
// @GET     Retrieves all Members.
// @POST    Creates a new Member.
// @access  public
router.route("/").get(helpers.getMembers).post(helpers.postMember);

// @route   api/members/:id
// @DELETE  Deletes all members.
// @PATCH  	Updates a member.
// @GET  	Retrieves a member.
// @access  public
router
	.route("/:id")
	.delete(helpers.deleteMember)
	.get(helpers.getMember)
	.patch(helpers.patchMember);

module.exports = router;
