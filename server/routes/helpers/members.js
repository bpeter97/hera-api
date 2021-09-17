const _ = require("lodash");
const Member = require("../../models/Member");

// @route   GET api/members/
// @desc    Retrieves all members
// @access  Private
exports.getMembers = (req, res) => {
	Member.find({})
		.then((members) => {
			if (!members) {
				return res.json({ error: "No members found." });
			}
			res.send(members);
		})
		.catch((e) => res.status(404).json(e));
};

// @route   GET api/members/:id
// @desc    Retrieves a Member
// @access  Private
exports.getMember = async (req, res) => {
	Member.findOne({ discordId: req.params.id })
		.then((member) => {
			if (!member) {
				return res.json({ error: "There was no member found" });
			}
			res.send(member);
		})
		.catch((e) => res.status(404).json(e));
};

// @route   POST api/members/
// @desc    Creates a new member
// @access  Private
exports.postMember = async (req, res) => {
	let data = {
		username: req.body.username,
		discordId: req.body.discordId,
		roles: req.body.roles,
	};

	let newMember = new Member(data);

	newMember
		.save()
		.then((member) => {
			if (!member) {
				return res.json({
					error: "There was an issue saving the member.",
				});
			}

			res.send(member);
		})
		.catch((e) => console.log(e));
};

// @route   PATCH api/members/
// @desc    Updates a member
// @access  Private
exports.patchMember = async (req, res) => {
	let update = {
		username: req.body.username,
		discordId: req.body.discordId,
		roles: req.body.roles,
	};

	let result = await Member.findOneAndUpdate(
		{ discordId: req.params.id },
		update,
		{ new: true }
	);

	if (!result) {
		return res.json({
			error: "There was an issue updating the member.",
		});
	}
};

// @route   DELETE api/members/
// @desc    Deletes a member
// @access  Private
exports.deleteMember = async (req, res) => {
	Member.findOneAndDelete({ discordId: req.params.id }).exec((err, doc) => {
		if (err) return res.status(40).json({ error: err });
		res.status(200).send(doc);
	});
};
