const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  res.send("login success");
});
module.exports = router;
