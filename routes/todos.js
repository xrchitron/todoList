const express = require("express");
const router = express.Router();
const db = require("../models");
const Todo = db.Todo;

router.get("/", async (req, res, next) => {
  console.log("session", req.session);
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  try {
    const todos = await Todo.findAll({
      attributes: ["id", "name", "isComplete"],
      offset: (page - 1) * limit,
      limit,
      raw: true,
    });
    res.render("todos", {
      todos,
      prev: page > 1 ? page - 1 : page,
      next: page + 1,
      page,
    });
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
});

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", async (req, res, next) => {
  try {
    const name = req.body.name;
    const showName = await Todo.create({ name });
    console.log(showName.toJSON());
    req.flash("success", "Add successfully");
    res.redirect("/todos");
  } catch (error) {
    error.errorMessage = "over-length";
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByPk(id, {
      attributes: ["id", "name", "isComplete"],
      raw: true,
    });
    res.render("todo", { todo });
  } catch (error) {
    error.errorMessage = "server error";
    next(error);
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByPk(id, {
      attributes: ["id", "name", "isComplete"],
      raw: true,
    });
    res.render("edit", { todo });
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, isComplete } = req.body;
    const id = req.params.id;
    await Todo.update({ name, isComplete: isComplete === "completed" }, { where: { id } });
    req.flash("success", "Update successfully");
    res.redirect(`/todos/${id}`);
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await Todo.destroy({ where: { id } });
    req.flash("success", "Delete successfully");
    res.redirect("/todos");
  } catch (error) {
    error.errorMessage = "Delete unsuccessfully";
    next(error);
  }
});
module.exports = router;
