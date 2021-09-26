require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
var server = require("http").createServer(app);
global.io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});
const mongoose = require("mongoose");

// middleware
app.use(express.json());
app.use(cors());

// routes
const tasks = require("./routes/api/tasks");
const events = require("./routes/api/events");
const discord = require("./routes/api/discord");
const items = require("./routes/api/items");
const regions = require("./routes/api/regions");
const members = require("./routes/api/members");
const logs = require("./routes/api/logs");

app.use("/api/tasks", tasks);
app.use("/api/events", events);
app.use("/api/discord", discord);
app.use("/api/items", items);
app.use("/api/regions", regions);
app.use("/api/members", members);
app.use("/api/logs", logs);

var db;
if (process.env.NODE_ENV === "development") {
	db = process.env.DEV_DB;
} else {
	db = process.env.DB_URI;
}

// Connect to the DB.
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("DB Connected"))
	.catch((err) => console.error("DB Error", err));

// declare port
const port = process.env.PORT || 5000;

// start the server
server.listen(port, () => console.log(`Server started on port ${port}.`));

module.exports = io;
