const userService = require("../services/user-service");

//Mainpage
async function getUserList(req, res) {
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
}

async function getOneUser(req, res) {
  const userId = req.params.id;
  const response = await userService.getASpecificUser(userId);

  if (response) {
    console.log("User found.");
    res.render("users/addOrEdit", {
      viewTitle: "Update User",
      user: response
    });
  } else {
    console.log("User not found.");
  }
}

//UpdateRecord
async function modifyUser(req, res) {
  const userId = req.params.id;
  const userData = req.body;
  const response = await userService.updateUser(userId, userData);
  if (response) {
    console.log("User Updated");
    res.redirect("/users/list");
  } else {
    console.log("Error during record update : " + err);
    res.render("/users/addOrEdit", {
      viewTitle: "Update User",
      user: req.body
    });
  }
}

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
//RegisterNewUser
async function insertUser(req, res) {
  console.log("Inserting user in the DB");
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

//Log In function
async function logIn(req, res) {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const response = await userService.logIn(userEmail, userPassword);
  if (response) {
    res.redirect("/api/users");
  } else {
    console.log("Email or Password not found. Try Again.");
    res.redirect("/api/login");
  }
}

function logInForm(req, res) {
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
}

//Delete User by ID
async function deleteUser(req, res) {
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
}

//Enroll User In a Course
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

async function deleteCourseInUser(req, res) {
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

module.exports = {
  getUserList,
  getOneUser,
  modifyUser,
  insertUser,
  deleteUser,
  logIn,
  logInForm,
  insertCourseInUser,
  deleteCourseInUser
};
