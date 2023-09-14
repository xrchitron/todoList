//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const user = require("./user");
const todos = require("./todos");
const authHandler = require("../middlewares/auth-handler");
const oAuth = require("./oAuth");

router.use(user);
router.use("/todos", authHandler, todos);
router.use(oAuth);
router.get("/", renderIndex);

//export router
module.exports = router;

function renderIndex(req, res) {
  return res.redirect("/todos");
}
