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

router.post("/users", register);

router.post("/logout", (req, res) => {
  res.send("logout get in");
});

function checkRequiredFields(email, password, confirmPassword) {
  if (!email || !password) {
    return { status: false, message: "Email and password are required" };
  }
  if (password !== confirmPassword) {
    return { status: false, message: "Passwords do not match" };
  }
  return;
}
async function checkExistingUser(email) {
  const checkEmail = await User.findAll({
    where: { email },
    raw: true,
  });
  if (checkEmail.length === 0) {
    return { status: false, message: "Email already exists" };
  }
  return;
}
async function createUser(name, email, password) {
  await User.create({ name, email, password });
  return { status: true, message: "User registered successfully" };
}
async function register(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const checkFields = checkRequiredFields(email, password, confirmPassword);
    if (!checkFields.status) {
      req.flash("register", checkFields.message);
      return res.redirect("back");
    }

    const checkUser = await checkExistingUser(email);
    if (!checkUser.status) {
      req.flash("register", checkUser.message);
      return res.redirect("back");
    }

    const createUserStatus = await createUser(name, email, password);
    if (createUserStatus.status) {
      req.flash("register", createUserStatus.message);
      return res.redirect("login");
    }
  } catch (error) {
    error.errorMessage = "Registration error";
    next(error);
  }
}

module.exports = router;
