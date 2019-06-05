const userService = require("../services/user-service");

const getUserList = (_req, res) => {
  const userList = userService.getAllUsers();
  res.render("users/users", {
    userList
  });
};

const addUser = (req, res) => {
  const { user } = req.body;

  if (!user.length) {
    return res.render("error", {
      message: "User cannot be empty"
    });
  }

  userService.addUser(user);
  res.redirect("/users");
};

// GET /:user/edit
const updateUserForm = (req, res) => {
  const { user } = req.params;
  res.render("users/edit-form", {
    user
  });
};

// POST /users/:user
const updateUser = (req, res) => {
  const oldUser = req.params.user;
  const { user } = req.body;
  userService.updateUser(oldUser, user);
  res.redirect(`/users/${user}/`);
};

// GET /users/:user
const deleteUserConfirmation = (req, res) => {
  const { user } = req.params;
  res.render("users/confirm-delete", { user });
};

// DELETE /users/:user
const deleteUser = (req, res) => {
  const { user } = req.params;
  userService.deleteUser(user);
  res.redirect("/users");
};

// GET /users/:user
const getSingleUser = (req, res) => {
  const { user } = req.params;
  res.render("users/single-user", { user });
};

// POST /api/users/:name/courses
const enrollInCourse = (req, res) => {
  const { name } = req.params;

  const user = getASpecificUser(name);

  if (!user) {
    return res.status(404).send("The user with the given NAME was not found");
  }

  const course = courses.find(
    courseElem => courseElem.courseName === req.body.courseName
  );

  if (!course) {
    return res.status(404).send("The course with the given NAME was not found");
  }

  if (user.enrolledCourses.length >= 1) {
    const userAlreadyEnrolled = user.enrolledCourses.find(
      courseElem => courseElem.courseName === course.courseName
    );
    if (userAlreadyEnrolled) {
      console.log("Already Enrolled");
      return res.status(404).send("Already Enrolled");
    }
  }
  courseService.registerCourseInUser(user.name, course);
  res.redirect(`/users/${user.name}`);
};

const removeCourseFromUser = (req, res) => {
  const { name } = req.params;
  const user = getASpecificUser(name);

  if (!user) {
    return res.status(404).send("The user with the given NAME was not found");
  }

  const { courseName } = req.params;

  if (!courseName) {
    return res.status(404).send("The course with the given NAME was not found");
  }

  if (user.enrolledCourses.length === 0) {
    return res.status(404).send("Course Not Found");
  }

  userService.removeCourseInUser();

  res.send(user.enrolledCourses);
};

module.exports = {
  getUserList,
  addUser,
  updateUser,
  updateUserForm,
  getSingleUser,
  deleteUserConfirmation,
  deleteUser,
  enrollInCourse,
  removeCourseFromUser
};
