module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "no logging");
  return res.redirect("/login");
};
