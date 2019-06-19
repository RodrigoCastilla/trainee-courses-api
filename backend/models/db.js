const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/CoursesAPI",
  { useNewUrlParser: true, useFindAndModify: false },
  err => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", true);
mongoose.set("useCreateIndex", true);

require("./courses.model");
require("./users.model");
