const { Router } = require("express");
const coursesRouter = Router();
const coursesController = require("../controllers/courses-controller");
const courseValidator = require("../middlewares/course-middleware");
const tokenValidator = require("../middlewares/token-middleware");

//-----------------------------------------Course CRUD ---------------

/**
 * This route find all the registered courses and send it, as a list
 * to the front-end.
 */
coursesRouter.get(
  "/",
  tokenValidator.verifyToken,
  tokenValidator.verifyUser,
  coursesController.getCoursesList
);

//Get One Course
coursesRouter.get(
  "/:id",
  tokenValidator.verifyToken,
  tokenValidator.verifyUser,
  coursesController.getOneCourse
);

//Register new Course
coursesRouter.post(
  "/register",
  // tokenValidator.verifyToken,
  // tokenValidator.verifyAdmin,
  courseValidator.validateAllBodyAttributes,
  coursesController.createNewCourse
);

//Modify one Course
coursesRouter.put(
  "/:id",
  // tokenValidator.verifyToken,
  // tokenValidator.verifyAdmin,
  courseValidator.validateAllBodyAttributes,
  coursesController.modifyCourse
);

//Delete Course
coursesRouter.delete(
  "/:id",
  tokenValidator.verifyToken,
  tokenValidator.verifyAdmin,
  coursesController.deleteCourse
);

//Get The list of Users
coursesRouter.get(
  "/list",
  tokenValidator.verifyToken,
  tokenValidator.verifyUser,
  async (req, res) => {
    await res.redirect("/api/courses");
  }
);

//-----------------------------------------Course CRUD END---------------

//-----------------------------------------Course Enrollment -----------

//Enroll one user into course
coursesRouter.put(
  "/:courseId/users",
  tokenValidator.verifyToken,
  tokenValidator.verifyAdmin,
  coursesController.registerUserInCourse
);

//Remove one user into course
coursesRouter.post(
  "/:courseid/users/:userId",
  tokenValidator.verifyToken,
  tokenValidator.verifyAdmin,
  coursesController.removeUserInCourse
);
//-----------------------------------------Course Enrollment END -----------

//------------------------------------------User's Auth END--------------------

module.exports = coursesRouter;
