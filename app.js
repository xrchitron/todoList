const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/todos", (req, res) => {
  res.send("get all todos");
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

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
