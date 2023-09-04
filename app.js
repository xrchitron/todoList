const express = require("express");
const asyncHandler = require("express-async-handler");
const methodOverride = require("method-override");
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

// app.get("/todos/:id/edit", (req, res) => {
//   const id = req.params.id;
//   return Todo.findByPk(id, {
//     attributes: ["id", "name"],
//     raw: true,
//   }).then((todo) => res.render("edit", { todo }));
// });

app.get(
  "/todos/:id/edit",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const todo = await Todo.findByPk(id, {
      attributes: ["id", "name"],
      raw: true,
    });
    res.render("edit", { todo });
  })
);

// app.put("/todos/:id", (req, res) => {
//   const name = req.body.name;
//   const id = req.params.id;
//   return Todo.update({ name }, { where: { id } }).then(() => res.redirect(`/todos/${id}`));
// });

app.put(
  "/todos/:id",
  asyncHandler(async (req, res) => {
    const name = req.body.name;
    const id = req.params.id;
    await Todo.update({ name }, { where: { id } });
    res.redirect(`/todos/${id}`);
  })
);

app.delete(
  "/todos/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Todo.destroy({ where: { id } });
    res.redirect("/todos");
  })
);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
