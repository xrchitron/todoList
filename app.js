const express = require("express");
// const asyncHandler = require("express-async-handler");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const router = require("./routes"); //index.js would be found automatically
const { engine } = require("express-handlebars"); //view template engine
const messageHandler = require("./middlewares/message-handler");
const errorHandler = require("./middlewares/error-handler");
const app = express();
const port = 3000;
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(messageHandler);
app.use(router); //invoke router
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is running on port http://localhost:${port}`);
});
