const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Course = mongoose.model("Course");
const localStorage = require("local-storage");
const jwt = require("jsonwebtoken");
const userService = require("../services/user-service");

//Mainpage
router.get("/" /*, verifyToken, verifyUser*/, async (req, res) => {
  const resp = await userService.getAllUsers(); //userService.getAllUsers();
  console.log("respuesta");
  console.log(resp);
  if (resp) {
    res.render("users/list", {
      list: resp
    });
    res.json(resp);
  } else {
    console.log("Error retrieving user list: " + err);
  }
});

//UpdateRecord
router.put(
  "/:id",
  // verifyToken,
  // verifyAdmin,
  async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    const response = await userService.updateUser(userId, userData);
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
);

//RegisterNewUser
router.post("/register", verifyToken, verifyAdmin, async (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  const response = await userService.addUser(newUser);
  if (response) {
    res.redirect("/api/users");
  } else {
    res.redirect("/api/users");
  }
});

//Enroll User In a Course
router.put(
  "/:userId/courses",
  // verifyToken,
  // verifyUser,
  async (req, res) => {
    const courseId = req.body._id;
    const userId = req.params.userId;

    const response = await userService.registerCourseInUser(userId, courseId);
    console.log("r");
    console.log(response);
    if (response) {
      console.log("course registered.");
      res.redirect("/api/users/list");
    } else {
      console.log("Error during course register");
      res.render("users/addOrEdit", {
        viewTitle: "Update User",
        user: req.body
      });
    }
  }
);

//Remove a User In a Course
router.delete(
  "/:userId/courses/:courseName",
  // verifyToken,
  // verifyUser,
  async (req, res) => {
    const userId = req.params.userId;
    const courseName = req.params.courseName;
    const response = await userService.removeCourseInUser(userId, courseName);

    if (response) {
      console.log("Course deleted.");
      res.redirect("/api/users/list");
    } else {
      console.log("Error during record update : " + err);
      res.render("users/addOrEdit", {
        viewTitle: "Update User",
        user: req.body
      });
    }
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
                    <input name= 'password' type= 'password' placeholder= 'pwd here' />
                    <button>Log</button>
                </form>`);
  // res.json({
  //     message: "Holi",
  //     authData
  // }
  // });
});

//
router.post("/login", async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const response = await userService.logIn(userEmail, userPassword);
  if (response) {
    res.redirect("/api/users");
  } else {
    console.log("Email or Password not found. Try Again.");
    res.redirect("/api/login");
  }
});

router.get("/:id", verifyToken, verifyUser, async (req, res) => {
  const userId = req.params._id;
  const response = await userService.getASpecificUser(userId);

  if (response) {
    console.log("User found.");
    res.render("users/addOrEdit", {
      viewTitle: "Update User",
      user: doc
    });
  } else {
    console.log("User not found.");
  }
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

{
    "name": "Panchito",
    "email": "panchito666@evilcorp.com",
    "password": "passwordofevil",
    "role": "User"
}
*/
//Insert New User Function
async function insertUser(req, res) {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  const response = await userService.addUser(newUser);
  if (response) {
    res.redirect("/api/users");
  } else {
    res.redirect("/api/users");
  }
}

//Register a course in user - Function
async function insertCourseInUser(req, res) {
  const courseId = req.body._id;
  const userId = req.params.userId;

  const response = await userService.registerCourseInUser(userId, courseId);
  console.log("r");
  console.log(response);
  if (response) {
    console.log("course registered.");
    res.redirect("/api/users/list");
  } else {
    console.log("Error during course register");
    res.render("users/addOrEdit", {
      viewTitle: "Update User",
      user: req.body
    });
  }
}

//Remove a course in user - Function
async function removeCourseInUser(req, res) {
  const userId = req.params.userId;
  const courseName = req.params.courseName;
  const response = await userService.removeCourseInUser(userId, courseName);

  if (response) {
    console.log("Course deleted.");
    res.redirect("/api/users/list");
  } else {
    console.log("Error during record update : " + err);
    res.render("users/addOrEdit", {
      viewTitle: "Update User",
      user: req.body
    });
  }
}

//Update User Data
async function updateRecord(req, res) {}

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
