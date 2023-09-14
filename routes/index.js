//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const user = require("./user");
const todos = require("./todos");
const authHandler = require("../middlewares/auth-handler");
const passport = require("passport");

router.use(user);
router.use("/todos", authHandler, todos);

router.get("/", (req, res) => {
  res.redirect("/todos");
});
router.get("/login/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
//export router
module.exports = router;
