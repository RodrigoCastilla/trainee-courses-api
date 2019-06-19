require("./models/db");

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyparser = require("body-parser");

const coursesRouter = require("./routes/course-router");
const usersRouter = require("./routes/user-router");

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);

// app config
// app.set("view engine", "pug");
// app.set("views", "./views");

// HTTP: Request - Response
// app.use(express.static("public"));
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }));

app.use(bodyparser.json());
app.set("views", path.join(__dirname, "/views/"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname + "/views/layouts/"
  })
);
app.set("view engine", "hbs");

app.listen(8080, () => {
  console.log("Express server started at port : 3000");
});

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
