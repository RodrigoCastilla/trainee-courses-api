const { Router } = require("express");
const coursesController = require("../controllers/courses-controller");
const courseValidator = require("../middelwares/course-validator");

const coursesRouter = Router();

// POST /courses
// headers... body...

// [express.static]
// [bodyParser.json]
// [bodyParser.urlencoded]
// [courseRouter]
// [validateCourse]
// [courseController.addCourse]

// endpoint: method + route
// controller action should handle an endpoint

// render the add course form
coursesRouter.get("/", coursesController.getCourseList);

// Adding a course
coursesRouter.post(
  "/",
  courseValidator.isValidCourse,
  coursesController.addCourse
);

// view single course
coursesRouter.get("/:course", coursesController.getSingleCourse);

// render form to update course
coursesRouter.get("/:course/edit", coursesController.updateCourseForm);

coursesRouter.post(
  "/:course/edit",
  courseValidator.isValidCourse,
  coursesController.updateCourse
);

// render form to delete course
coursesRouter.get(
  "/:course/delete",
  coursesController.deleteCourseConfirmation
);

coursesRouter.post("/:course/delete", coursesController.deleteCourse);

module.exports = coursesRouter;
