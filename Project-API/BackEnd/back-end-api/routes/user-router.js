const { Router } = require("express");
const usersRouter = Router();
const usersController = require("../controllers/users-controller");
const userValidator = require("../middlewares/user-middleware");

//Mainpage
usersRouter.get("/", verifyToken, verifyUser, (req, res) => {});

//UpdateRecord
usersRouter.put("/:id", verifyToken, verifyAdmin, (req, res) => {
  updateRecord(req, res);
});

//RegisterNewUser
usersRouter.post("/register", verifyToken, verifyAdmin, (req, res) => {
  insertUser(req, res);
});

//Enroll User In a Course
usersRouter.put("/:userId/courses", verifyToken, verifyUser, (req, res) => {
  insertCourseInUser(req, res);
});

//Remove a User In a Course
usersRouter.delete(
  "/:userId/courses/:courseName",
  verifyToken,
  verifyUser,
  (req, res) => {
    removeCourseInUser(req, res);
  }
);

//Get The list of Users
usersRouter.get("/list", verifyToken, verifyUser, (req, res) => {});

//
usersRouter.get("/login" /*, verifyToken*/, (req, res) => {
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
usersRouter.post("/login", (req, res) => {});

//
usersRouter.get("/:id" /*, verifyToken, verifyUser*/, (req, res) => {});

//Delete User by ID
usersRouter.delete("/:id", verifyToken, verifyAdmin, (req, res) => {});

module.exports = usersRouter;
