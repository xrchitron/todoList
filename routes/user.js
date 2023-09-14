const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    //checkExistingUser
    return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        //checkExistingUser
        if (!user) {
          return done(null, false, { message: "email or password incorrect" });
        }
        return bcrypt.compare(password, user.password).then((isMatch) => {
          //checkPasswordMatch
          if (!isMatch) {
            return done(null, false, { message: "email or password incorrect" });
          }
          //get user info
          return done(null, user);
        });
      })
      .catch((error) => {
        error.errorMessage = "login failure";
        done(error);
      });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      return User.findOne({
        attributes: ["id", "name", "email"],
        where: { email },
        raw: true,
      }).then((user) => {
        if (user) return done(null, user);

        const randomPwd = Math.random().toString(36).slice(-8);
        return bcrypt
          .hash(randomPwd, 10)
          .then((hash) => {
            User.create({ name, email, password: hash });
          })
          .then((user) => {
            done(null, { id: user.id, name: user.name, email: user.email });
          })
          .catch((error) => {
            error.errorMessage = "Login Failure";
            done(error);
          });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/users", register);

router.post("/logout", logout);
module.exports = router;
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
