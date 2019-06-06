const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Course = mongoose.model("Course");

router.get("/", (req, res) => {
  res.json("sample text");
});

router.post("/", (req, res) => {
  updateRecord(req, res);
});

router.post("/register", (req, res) => {
  insertUser(req, res);
});

router.put("/:userId/courses", (req, res) => {
  insertCourseInUser(req, res);
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
  User.findById(req.params._id, (err, doc) => {
    if (!err) {
      res.render("users/addOrEdit", {
        viewTitle: "Update User",
        user: doc
      });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      console.log("Eliminado");
      res.redirect("/api/users/list");
    } else {
      console.log("Error in user delete :" + err);
    }
  });
});

/*
{
  "name" : "Rodrigo",
	"email": "rcastillalp@gmail.com",
	"password" : "contraseña",
	"role" : "Admin"
}
*/
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

function insertCourseInUser(req, res) {
  Course.find({ name: req.body.courseName }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
    //Insert course into enrooledCourses Array
    let datos = data;
    User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $push: {
          enrolledCourses: data
        }
      },
      { new: true },
      (err, doc) => {
        if (!err) {
          //   User.find({ _id: req.params.id }, (err, data) => {
          //     Course.findOneAndUpdate(
          //       { _id: req.body.courseName },
          //       {
          //         $push: {
          //           enrolledCourses: data
          //         }
          //       },
          //       { new: true }
          //     );
          //   });
          res.redirect("/api/users/list");
        } else {
          if (err.name == "ValidationError") {
            handleValidationError(err, req.body);
            res.render("users/addOrEdit", {
              viewTitle: "Update User",
              user: req.body
            });
          } else console.log("Error during record update : " + err);
        }
      }
    );
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
            user: req.body
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
