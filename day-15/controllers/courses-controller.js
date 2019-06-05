const courseService = require("../services/course-service");

const getCourseList = (_req, res) => {
  const courseList = courseService.getAllCourses();
  res.render("courses/courses", {
    courseList
  });
};

const addCourse = (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courseService.getAllCourses.length + 1,
    name: req.body.name
  };
  courseService.addCourse(course);
  res.redirect("/courses");
};

// GET /:course/edit
const updateCourseForm = (req, res) => {
  const { course } = req.params;
  res.render("courses/edit-form", {
    course
  });
};

// POST /courses/:course
const updateCourse = (req, res) => {
  const oldCourse = req.params.course;
  const { course } = req.body;
  courseService.updateCourse(oldCourse, course);
  res.redirect(`/courses/${course}/`);
};

// GET /courses/:course
const deleteCourseConfirmation = (req, res) => {
  const { course } = req.params;
  res.render("courses/confirm-delete", { course });
};

// DELETE /courses/:course
const deleteCourse = (req, res) => {
  const { course } = req.params;
  courseService.deleteCourse(course);
  res.redirect("/courses");
};

// GET /courses/:course
const getSingleCourse = (req, res) => {
  const { course } = req.params;
  res.render("courses/single-course", { course });
};

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}

module.exports = {
  getCourseList,
  addCourse,
  updateCourse,
  updateCourseForm,
  getSingleCourse,
  deleteCourseConfirmation,
  deleteCourse
};
