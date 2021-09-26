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
		commends: 0,
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
			console.log(chalk.yellow(`There was a new member created`, member));
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
		{ new: true, upsert: true }
	);

	if (!result) {
		console.log(
			chalk.red(`There an issue finding and updating the member`, result)
		);
		return res.json({
			error: "There was an issue updating the member.",
		});
	} else {
		console.log(chalk.yellow(`There was a new member updated`, result));
		res.send(result);
	}
};

// @route   DELETE api/members/
// @desc    Deletes a member
// @access  Private
exports.deleteMember = async (req, res) => {
	Member.findOneAndDelete({ discordId: req.params.id }).exec((err, doc) => {
		if (err) return res.status(40).json({ error: err });
		console.log(chalk.yellow(`There was a member deleted`, doc));
		res.status(200).send(doc);
	});
};

// @route   GET api/members/commend/:id
// @desc    Commends a member
// @access  Private
exports.commendMember = async (req, res) => {
	let commend = _.pick(req.body, ["type", "reason"]);

	let result = await Member.findOneAndUpdate(
		{ discordId: req.params.discordid },
		{ $push: { commendList: commend }, $inc: { commends: 1 } },
		{ new: true }
	).then();

	if (!result) {
		return res.json({
			error: "There was an issue updating the member.",
		});
	} else {
		res.send(result);
	}
};

// @route   GET api/members/commend/:username/:amount
// @desc    Commends a member with teh number passed in params
// @access  Private
exports.commendMemberMultiple = async (req, res) => {
	let result = await Member.findOneAndUpdate(
		{
			$or: [
				{ username: req.params.username },
				{ discordId: req.params.username },
			],
		},
		{ $inc: { commends: req.params.amount } },
		{ new: true }
	);

	if (!result) {
		return res.json({
			error: "There was an issue updating the member.",
		});
	} else {
		res.send(result);
	}
};
