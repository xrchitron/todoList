const express = require("express");
// const asyncHandler = require("express-async-handler");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const port = 3000;

const { engine } = require("express-handlebars");

const db = require("./models");
const Todo = db.Todo;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "ThisIsSecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/todos", async (req, res) => {
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

app.get("/todos/new", (req, res) => {
  try {
    return res.render("new", { error: req.flash("error") });
  } catch (error) {
    console.log(error);
    req.flash("error", "server error");
    res.redirect("back");
  }
});

app.post("/todos", async (req, res) => {
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

app.get("/todos/:id", async (req, res) => {
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

app.get("/todos/:id/edit", async (req, res) => {
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

app.put("/todos/:id", async (req, res) => {
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

app.delete("/todos/:id", async (req, res) => {
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

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
