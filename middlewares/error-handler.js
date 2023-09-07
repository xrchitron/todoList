module.exports = (error, req, res, next) => {
  console.log(error);
  req.flash("error", error.errorMessage || "operation failed");
  res.redirect("back");
  next(error);
};
