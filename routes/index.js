//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const login = require("./login");
const todos = require("./todos");

router.use("/login", login);
router.use("/todos", todos);
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/users", (req, res) => {
  res.send("users");
});
router.post("/logout", (req, res) => {
  res.send("logout get in");
});
router.get("/", (req, res) => {
  res.render("index");
});

//export router
module.exports = router;
