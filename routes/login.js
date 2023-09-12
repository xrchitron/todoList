const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  res.send("login success");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/users", async (req, res, next) => {
  try {
    const name = req.body.userName;
    const email = req.body.userEmail;
    const password = req.body.userPassword;
    const confirmPassword = req.body.confirmPassword;
    if (!email || !password) {
      req.flash("register", "email and password are required");
      return res.redirect("back");
    } else if (password !== confirmPassword) {
      req.flash("register", "password doesn't match");
      return res.redirect("back");
    }
    const checkEmail = await User.findAll({
      where: { email },
      raw: true,
    });
    if (checkEmail === []) {
      req.flash("register", "email existed");
      return res.redirect("back");
    }
    await User.create({ name, email, password });
    req.flash("register", "register successfully");
    res.redirect("login");
  } catch (error) {
    error.errorMessage = "server error";
    next(error);
  }
});

router.post("/logout", (req, res) => {
  res.send("logout get in");
});
module.exports = router;
