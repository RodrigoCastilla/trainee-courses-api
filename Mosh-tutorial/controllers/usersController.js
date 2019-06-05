const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.get("/", (req, res) => {
  res.json("sample text");
});

router.post("/register", (req, res) => {
  insertUser(req, res);
});

router.get("/list", (req, res) => {
  //   res.json("from list");
  User.find((err, docs) => {
    if (!err) {
      res.render("users/list", {
        list: docs
      });
    } else {
      console.log("Error retrieving user list: " + err);
    }
  });
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("user/addOrEdit", {
        viewTitle: "Update User",
        employee: doc
      });
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/user/list");
    } else {
      console.log("Error in user delete :" + err);
    }
  });
});

function insertUser(req, res) {
  const user = new User();
  const { name } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { role } = req.body;
  user.name = name;
  user.email = email;
  user.password = password;
  user.role = role;
  user.enrolledCourses = [];
  user.save((err, doc) => {
    if (!err) {
      res.redirect("/api/users/list");
    } else {
      if (err.name == ValidationError) handleValidationError(err, req.body);
      else console.log("Error during record insertion: " + err);
    }
  });
}

function updateRecord(req, res) {
  User.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("users/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("users/addOrEdit", {
            viewTitle: "Update User",
            employee: req.body
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "name":
        body["fullNameError"] = err.errors[field].message;
      case "email":
        body["emailError"] = err.errors[field].message;
      case "password":
        body["password"] = err.errors[field].message;
      case "role":
        body["role"] = err.errors[field].message;
    }
  }
}
// function insertRecord() {}

module.exports = router;
