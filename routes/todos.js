const express = require("express");
const router = express.Router();
const db = require("../models");
const Todo = db.Todo;

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll({
      attributes: ["id", "name", "isComplete"],
      raw: true,
    });
    res.render("todos", { todos, message: req.flash("success") });
  } catch (error) {
    console.log(error);
    req.flash("error", "server error");
    res.redirect("back");
  }
});

router.get("/new", (req, res) => {
  try {
    return res.render("new", { error: req.flash("error") });
  } catch (error) {
    console.log(error);
    req.flash("error", "server error");
    res.redirect("back");
  }
});

router.post("/", async (req, res) => {
  try {
    const name = req.body.name;
    const showName = await Todo.create({ name });
    console.log(showName.toJSON());
    req.flash("success", "Add successfully");
    res.redirect("/todos");
  } catch (error) {
    console.log(error);
    req.flash("error", "over-length");
    // res.redirect("/todos/new"); is also fine
    res.redirect("back");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByPk(id, {
      attributes: ["id", "name", "isComplete"],
      raw: true,
    });
    res.render("todo", { todo, message: req.flash("success") });
  } catch (error) {
    console.log(error);
    req.flash("error", "server error");
    res.redirect("back");
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
    console.log(error);
    req.flash("error", "server error");
    res.redirect("back");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, isComplete } = req.body;
    const id = req.params.id;
    await Todo.update({ name, isComplete: isComplete === "completed" }, { where: { id } });
    req.flash("success", "Update successfully");
    res.redirect(`/todos/${id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "server error");
    res.redirect("back");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Todo.destroy({ where: { id } });
    req.flash("success", "Delete successfully");
    res.redirect("/todos");
  } catch (error) {
    console.log(error);
    req.flash("error", "delete unsuccessfully");
    res.redirect("back");
  }
});
module.exports = router;
