const express = require("express");
const router = express.Router();
const db = require("../models");
const Todo = db.Todo;

router.get("/", getTodoList);
router.get("/new", renderCreatePage);
router.post("/", createTodo);
router.get("/:id", getTodoDetail);
router.get("/:id/edit", getTodoEdit);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
module.exports = router;

async function getTodoDetail(req, res, next) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const todo = await findTodoById(id);
    checkTodoExist(todo);
    checkUserAuthorization(todo, userId);
    res.render("todo", { todo });
  } catch (error) {
    getTodoErrorHandler(error, req, res, next);
  }
}
async function findTodoById(id) {
  const todo = await Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete", "userId"],
    raw: true,
  });
  return todo;
}
function checkTodoExist(todo) {
  if (!todo) {
    throw new Error("Todo not found");
  }
}
function checkUserAuthorization(todo, userId) {
  if (todo.userId !== userId) {
    throw new Error("Unauthorized");
  }
}
function getTodoErrorHandler(error, req, res, next) {
  if (error.message === "Todo not found") {
    req.flash("error", "data not found");
    return res.redirect("/todos");
  } else if (error.message === "Unauthorized") {
    req.flash("error", "Unauthorized");
    return res.redirect("/todos");
  } else {
    error.errorMessage = "server error";
    next(error);
  }
}
async function getTodoEdit(req, res, next) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const todo = await findTodoById(id);
    checkTodoExist(todo);
    checkUserAuthorization(todo, userId);
    res.render("edit", { todo });
  } catch (error) {
    getTodoErrorHandler(error, req, res, next);
  }
}
async function createTodo(req, res, next) {
  try {
    const name = req.body.name;
    const userId = req.user.id;
    await Todo.create({ name, userId });
    req.flash("success", "Add successfully");
    res.redirect("/todos");
  } catch (error) {
    error.errorMessage = "over-length";
    next(error);
  }
}
async function updateTodo(req, res, next) {
  try {
    const { name, isComplete } = req.body;
    const id = req.params.id;
    const userId = req.user.id;
    const todo = await findTodoById(id);
    checkTodoExist(todo);
    checkUserAuthorization(todo, userId);
    await todo.update({ name, isComplete: isComplete === "completed" });
    req.flash("success", "Update successfully");
    res.redirect(`/todos/${id}`);
  } catch (error) {
    getTodoErrorHandler(error, req, res, next);
  }
}
async function deleteTodo(req, res, next) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const todo = await findTodoById(id);
    checkTodoExist(todo);
    checkUserAuthorization(todo, userId);
    await Todo.destroy({ where: { id } });
    req.flash("success", "Delete successfully");
    res.redirect("/todos");
  } catch (error) {
    getTodoErrorHandler(error, req, res, next);
  }
}
function renderCreatePage(req, res) {
  res.render("new");
}
async function getTodoList(req, res, next) {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  try {
    const todos = await Todo.findAll({
      attributes: ["id", "name", "isComplete"],
      where: { userId },
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
}
