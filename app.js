const express = require("express");
const config = require("./config");
const cors = require("cors");
const app = express();
const path = require('path')

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))

app.set("port", config.PORT);

module.exports = app;