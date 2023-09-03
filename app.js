const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const port = 3000;

const { engine } = require("express-handlebars");

const db = require("./models");
const Todo = db.Todo;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("index");
});

//class version
// app.get("/todos", (req, res) => {
//   return Todo.findAll({
//     attributes: ["id", "name"],
//     raw: true,
//   })
//     .then((todos) => res.render("todos", { todos }))
//     .catch((err) => {
//       res.status(422).json(err);
//     });
// });

//with asyncHandler and async / await method
app.get(
  "/todos",
  asyncHandler(async (req, res) => {
    const todos = await Todo.findAll({
      attributes: ["id", "name"],
      raw: true,
    });
    res.render("todos", { todos });
  })
);

app.get("/todos/new", (req, res) => {
  return res.render("new");
});

//class version
// app.post("/todos", (req, res) => {
//   const name = req.body.name;
//   return Todo.create({ name })
//     .then(() => res.redirect("/todos"))
//     .catch((err) => console.log(err));
// });

//with asyncHandler and async / await method
//console.log input value
app.post(
  "/todos",
  asyncHandler(async (req, res) => {
    const name = req.body.name;
    const showName = await Todo.create({ name });
    console.log(showName.toJSON());
    res.redirect("/todos");
  })
);

// app.get("/todos/:id", (req, res) => {
//   const id = req.params.id;
//   return Todo.findByPk(id, {
//     attributes: ["id", "name"],
//     raw: true,
//   })
//     .then((todo) => res.render("todo", { todo }))
//     .catch((err) => console.log(err));
// });

app.get(
  "/todos/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const todo = await Todo.findByPk(id, {
      attributes: ["id", "name"],
      raw: true,
    });
    res.render("todo", { todo });
  })
);

app.get("/todos/:id/edit", (req, res) => {
  res.send(`get todo edit: ${req.params.id}`);
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
