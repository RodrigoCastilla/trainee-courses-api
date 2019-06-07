const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Course = mongoose.model("Course");
const localStorage = require("local-storage");
const jwt = require("jsonwebtoken");

//Mainpage
router.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      console.log("forbidden from login");
      res.sendStatus(403);
    } else {
      console.log(authData);
      User.find((err, docs) => {
        if (!err) {
          // console.log(JSON.parse(localStorage.get("userToken")));
          res.render("users/list", {
            list: docs
          });
        } else {
          console.log("Error retrieving user list: " + err);
        }
      });
    }
  });
});

//UpdateRecord
router.post("/", verifyToken, (req, res) => {
  updateRecord(req, res);
});

//RegisterNewUser
router.post("/register", (req, res) => {
  insertUser(req, res);
});

//Enroll User In a Course
router.put("/:userId/courses", (req, res) => {
  insertCourseInUser(req, res);
});

//Remove a User In a Course
router.delete("/:userId/courses/:courseName", (req, res) => {
  removeCourseInUser(req, res);
});

//Get The list of Users
router.get("/list", (req, res) => {
  //   res.json("from list");

  res.redirect("/api/users");
});

//
router.get("/login" /*, verifyToken*/, (req, res) => {
  // jwt.verify(req.token, "secretKey", (err, authData) => {
  //   if (err) {
  //     console.log("forbidden from login");
  //     res.sendStatus(403);
  //   } else {
  res.send(`
                <form method='POST'>
                    <input name='email' type= 'email' placeholder= 'email here' />
                    <input name= 'name' type= 'password' placeholder= 'pwd here' />
                    <button>Log</button>
                </form>`);
  // res.json({
  //     message: "Holi",
  //     authData
  // }
  // });
});

//
router.post("/login", (req, res) => {
  User.find({ email: req.body.email }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const { name } = data.name;
    const { role } = data.role;
    console.log(data);
    const user = {
      name: name,
      email: req.body.email,
      role: role
    };
    console.log(user);
    jwt.sign(
      { user: user },
      "secretKey" /*, {expiresIn: '30s'} */,
      (err, token) => {
        localStorage.set("userToken", JSON.stringify(token));
        // res.json({
        //   token
        // });
        res.redirect("/api/users");
      }
    );
  });
});

//
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

//Delete User by ID
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      console.log("Eliminado");
      localStorage.remove("usuario");
      localStorage.clear();
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
//Insert New User Function
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

  localStorage.set("usuario", JSON.stringify(user));
  // console.log(JSON.parse(localStorage.get("userToken")));
  user.save((err, doc) => {
    if (!err) {
      // localStorage.setItem("usuario", JSON.stringify(user));
      res.redirect("/api/users/list");
    } else {
      if (err.name == ValidationError) handleValidationError(err, req.body);
      else console.log("Error during record insertion: " + err);
    }
  });
}

//Register a course in user - Function
function insertCourseInUser(req, res) {
  Course.find({ name: req.body.courseName }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    //Insert course into enrolledCourses Array
    // let datos = data;
    User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $addToSet: {
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

//Remove a course in user - Function
function removeCourseInUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      $pull: { enrolledCourses: { name: req.params.courseName } }
    },
    { new: true },
    (err, doc) => {
      if (!err) {
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
}

//Update User Data
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

//Format of Token
//Authorization: Bearer <acess_token>
//VerifyToken
function verifyToken(req, res, next) {
  const bearerHeader = JSON.parse(localStorage.get("userToken")); //req.headers["authorization"];
  //Check if bearer is undefined
  if (typeof bearerHeader !== null || typeof bearerHeader !== "undefined") {
    //aplit at the space
    //const bearer = bearerHeader.split(" ");
    //Get Token from array
    //const bearerToken = bearer[1];
    //Set the token
    // req.token = bearerToken;
    req.token = bearerHeader;
    //Next Middleware
    next();
  } else {
    //Forbidden
    console.log("Forbidden from VerifyToken");
    res.sendStatus(403);
  }
}

//Error Handler
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
