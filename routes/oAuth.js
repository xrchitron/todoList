//invoke express and express router
const express = require("express");
const router = express.Router();

const passport = require("passport");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/login/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;
