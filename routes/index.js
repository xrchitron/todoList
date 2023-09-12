//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const login = require("./login");
const todos = require("./todos");

router.use(login);
router.use("/todos", todos);

router.get("/", (req, res) => {
  res.render("index");
});

//export router
module.exports = router;
