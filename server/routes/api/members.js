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

// @route	api/members/commend/:username
// @PATCH	Increments a member's commends
// @access	Leadership roles
router.route("/commend/:username").get(helpers.commendMember);

// @route	api/members/commend/:username/:amount
// @PATCH	Increments a member's commends
// @access	Leadership roles
router.route("/commend/:username/:amount").get(helpers.commendMemberMultiple);

module.exports = router;
