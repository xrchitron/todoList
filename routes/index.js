//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const login = require("./login");
const todos = require("./todos");
const authHandler = require("../middlewares/auth-handler");

router.use(login);
router.use("/todos", authHandler, todos);

router.get("/", (req, res) => {
  res.redirect("/todos");
});

//export router
module.exports = router;
