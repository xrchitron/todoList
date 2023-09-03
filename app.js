const express = require("express");
const app = express();
const port = 3000;

const { engine } = require("express-handlebars");

const db = require("./models");
const Todo = db.Todo;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/todos", (req, res) => {
  return Todo.findAll({
    attributes: ["id", "name"],
    raw: true,
  })
    .then((todos) => res.render("todos", { todos }))
    .catch((err) => {
      res.status(422).json(err);
    });
});

app.get("/todos/:id", (req, res) => {
  res.send(`get todo id: ${req.params.id}`);
});

app.get("/todos/:id/edit", (req, res) => {
  res.send(`get todo edit: ${req.params.id}`);
});

app.get("/todos/new", (req, res) => {
  res.send("create new todo");
});

app.post("/todos", (req, res) => {
  res.send("send todo");
});

app.put("/todos/:id", (req, res) => {
  res.send(`todo id: ${req.params.id} has been modified`);
});

app.delete("/todos/:id", (req, res) => {
  res.send(`todos id: ${req.params.id} has been deleted`);
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
