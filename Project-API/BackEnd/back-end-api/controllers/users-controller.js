const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Course = mongoose.model("Course");
const localStorage = require("local-storage");
const jwt = require("jsonwebtoken");
const userService = require("../services/user-service");

//Mainpage
router.get("/", verifyToken, verifyUser, (req, res) => {
  const a = jwt.verify(req.token, "secretKey", (err, authData) => {
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
router.put("/:id", verifyToken, verifyAdmin, (req, res) => {
  updateRecord(req, res);
});

//RegisterNewUser
router.post("/register" /*, verifyToken, verifyAdmin*/, (req, res) => {
  insertUser(req, res);
});

//Enroll User In a Course
router.put(
  "/:userId/courses",
  /*verifyToken, verifyUser, */ (req, res) => {
    insertCourseInUser(req, res);
  }
);

//Remove a User In a Course
router.delete(
  "/:userId/courses/:courseName",
  // verifyToken,
  // verifyUser,
  (req, res) => {
    removeCourseInUser(req, res);
  }
);

//Get The list of Users
router.get("/list", verifyToken, verifyUser, (req, res) => {
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
    // console.log(data);
    const name = data[0].name;
    const role = data[0].role;
    const user = {
      name: name,
      email: req.body.email,
      role: role
    };
    // console.log(user);
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
router.get("/:id", verifyToken, verifyUser, (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (!err) {
      console.log(doc);
      res.render("users/addOrEdit", {
        viewTitle: "Update User",
        user: doc
      });
    }
  });
});

//Delete User by ID
router.delete("/:id", verifyToken, verifyAdmin, (req, res) => {
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
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  const response = userService.addUser(newUser);
  if (response) {
    res.redirect("/api/users");
  } else {
    res.redirect("/api/users");
  }
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
        // console.log(data);
        if (!err) {
          // Course.findOneAndUpdate(
          //   { id: data.id },
          //   {
          //     $addToSet: {
          //       enrolledUsers: doc
          //     }
          //   },
          //   { new: true },
          //   (err, courseDoc) => {
          //     if (!err) console.log(doc);
          //     else console.log("Error during record update : " + err);
          //   }
          // );
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

  const userId = req.params.userId;
  

  User.findOneAndUpdate(
    { id: req.params.userId },
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
  const userId = req.params.id;
  const userData = req.body;
  const response = userService.updateUser(userId, userData);
  if (response) {
    console.log("User Updated");
    res.redirect("users/list");
  } else {
    console.log("Error during record update : " + err);
    res.render("users/addOrEdit", {
      viewTitle: "Update User",
      user: req.body
    });
  }
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

function verifyUser(req, res, next) {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      console.log("Forbidden from User Verify");
      res.sendStatus(403);
    } else {
      if (authData.user.role === "User" || authData.user.role === "Admin") {
        next();
      }
    }
  });
}

function verifyAdmin(req, res, next) {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      console.log("Forbidden from User Verify");
      res.sendStatus(403);
    } else {
      if (authData.user.role === "Admin") {
        next();
      }
    }
  });
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
