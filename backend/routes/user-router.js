const { Router } = require("express");
const usersRouter = Router();
const usersController = require("../controllers/users-controller");
const tokenValidator = require("../middlewares/token-middleware");
const userValidator = require("../middlewares/user-middleware");

//-----------------------------------------Users CRUD ---------------

//Mainpage
usersRouter.get(
  "/",
  // tokenValidator.verifyToken,
  // tokenValidator.verifyUser,
  usersController.getUserList
);

//Get One User
usersRouter.get(
  "/:id",
  tokenValidator.verifyToken,
  tokenValidator.verifyUser,
  usersController.getOneUser
);

//UpdateRecord
usersRouter.put(
  "/:id",
  tokenValidator.verifyToken,
  tokenValidator.verifyAdmin,
  usersController.modifyUser
);

//RegisterNewUser
usersRouter.post(
  "/register",
  // tokenValidator.verifyToken,
  // tokenValidator.verifyAdmin,
  userValidator.validateAllBodyAttributes,
  usersController.insertUser
);

//Delete User by ID
usersRouter.delete(
  "/:id",
  tokenValidator.verifyToken,
  tokenValidator.verifyAdmin,
  usersController.deleteUser
);

//Get The list of Users
usersRouter.get(
  "/list",
  tokenValidator.verifyToken,
  tokenValidator.verifyUser,
  async (_req, res) => {
    await res.redirect("/api/users");
  }
);

//-----------------------------------------Users CRUD END---------------

//-----------------------------------------Course Enrollment -----------
//Enroll User In a Course
usersRouter.put(
  "/:userId/courses",
  // tokenValidator.verifyToken,
  // tokenValidator.verifyUser,
  usersController.insertCourseInUser
);

//Remove a User In a Course
usersRouter.delete(
  "/:userId/courses/:courseName",
  tokenValidator.verifyToken,
  tokenValidator.verifyUser,
  usersController.deleteCourseInUser
);

//-----------------------------------------Course Enrollment END -----------

//------------------------------------------User's Auth --------------------
//
usersRouter.get("/login", (req, res) => {
  res.send(`
                  <form method='POST'>
                      <input name='email' type= 'email' placeholder= 'email here' />
                      <input name= 'name' type= 'password' placeholder= 'pwd here' />
                      <button>Log</button>
                  </form>`);
});

//
usersRouter.post("/login", usersController.logIn);
//------------------------------------------User's Auth END--------------------

module.exports = usersRouter;
