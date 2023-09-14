const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;

router.get("/login", renderLogin);
router.get("/register", renderRegister);
router.post("/users", register);
router.post("/logout", logout);
module.exports = router;

function renderLogin(req, res) {
  return res.render("login");
}
function renderRegister(req, res) {
  return res.render("register");
}
function logout(req, res) {
  req.logout((error) => {
    if (error) {
      next(error);
    }
    return res.redirect("/login");
  });
}

function checkRequiredFields(email, password, confirmPassword) {
  if (!email || !password) {
    return { status: false, message: "Email and password are required" };
  }
  if (password !== confirmPassword) {
    return { status: false, message: "Passwords do not match" };
  }
  return { status: true };
}
async function checkExistingUser(email) {
  const checkEmail = await User.findAll({
    where: { email },
    raw: true,
  });
  console.log(checkEmail.length);
  if (checkEmail.length === 0) {
    return { status: false, message: "Email already exists" };
  }
  return { status: true };
}
async function createUser(name, email, password) {
  //generate hashed password
  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hash });
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
    if (checkUser.status) {
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
