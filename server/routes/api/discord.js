const router = require("express").Router();
var redirect = "https://hera-tasks.herokuapp.com/api/discord/callback";

const DiscordOauth2 = require("discord-oauth2");
const Member = require("../../models/Member");
const oauth = new DiscordOauth2({
	clientId: process.env.DAPP_CID,
	clientSecret: process.env.DAPP_SID,
	redirectUri: redirect,
});

// Retrieving a refresh code:
// oauth.tokenRequest({
// 	// clientId, clientSecret and redirectUri are omitted, as they were already set on the class constructor
// 	clientId: process.env.DAPP_CID,
// 	clientSecret: process.env.DAPP_SID,
// 	refreshToken: access_data.refresh_token,
// 	grantType: "refresh_token",
// 	scope: ["identify", "email","guilds"],
// 	redirectUri: redirect,
// });

// @route   api/discord
// @POST    redirects a user.
// @access  public
router.get("/", (req, res) => {
	res.redirect(process.env.RES_URL);
});

router.get("/callback", async (req, res) => {
	if (!req.query.code) throw new Error("NoCodeProvided");
	const code = req.query.code;

	oauth
		.tokenRequest({
			code: code,
			scope: "identify guilds",
			grantType: "authorization_code",
		})
		.then((access_data) => {
			let url = `${process.env.FRONTEND}?d=${access_data.access_token}`;
			res.redirect(url);
		});
});

router.get("/user", async (req, res) => {
	oauth
		.getUser(req.headers.authorization)
		.then((userInfo) => {
			let userData = {
				info: userInfo,
				guild: {},
				roles: [],
			};

			oauth.getUserGuilds(req.headers.authorization).then((guilds) => {
				found = guilds.find(
					(guild) => guild.id === process.env.GUILD_ID
				);

				userData.guild = found;

				if (!found) {
					res.status(401).send({
						error: "You must be apart of the units discord channel before being able to log in!",
					});
				} else {
					Member.findOne({ discordId: userData.info.id }).then(
						(member) => {
							if (!member) {
								console.log(member);
								return res.json({
									error: "There was no member found.",
								});
							}
							member.roles.forEach((role) => {
								userData.roles.push(role);
							});
							res.send(userData);
						}
					);
				}
			});
		})
		.catch((e) => console.log(e));
});

router.get("/user/logout", (req, res) => {
	// You must encode your client ID along with your client secret including the colon in between
	const credentials = Buffer.from(
		`${process.env.DAPP_CID}:${process.env.DAPP_SID}`
	).toString("base64");

	oauth.revokeToken(req.headers.authorization, credentials).then(console.log);
});

module.exports = router;
