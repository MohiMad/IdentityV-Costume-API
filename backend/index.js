const express = require("express");
const app = express();
const Utility = require("./src/Utility.js");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const staticData = require("./staticData.json");

app.use(cors({ orgin: "*" }));

app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, "..", "build")));
app.use("/public", express.static("public"));

fs.readdirSync("./routes").forEach((route) => {
    app.use(`/api/${route.replace(".js", "")}`, require(`./routes/${route}`));
});

staticData.redirections.forEach(({ route, redirectTo }) => {
    app.get(`/api/${route}/:name`, function (req, res) {
        res.redirect(`/api/${redirectTo}/${req.params.name}`);
    });
});

app.get("/version", (req, res) => res.json({ version: Utility.getVersion() }));

app.get("/*", (req, res) => {
    res.render(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(process.env.PORT || 3000);
