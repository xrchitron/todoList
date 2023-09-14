//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const user = require("./user");
const todos = require("./todos");
const authHandler = require("../middlewares/auth-handler");

router.use(user);
router.use("/todos", authHandler, todos);

router.get("/", (req, res) => {
  res.redirect("/todos");
});

//export router
module.exports = router;
