const courseService = require("../services/course-service");

//---------------------------------------------------COURSE CRUD -----------------------------------------------------------------

async function getCoursesList(req, res) {
  const courses = await courseService.getAllCourses();
  if (courses) {
    res.json(courses);
  } else {
    console.log("Error retrieving courses list");
  }
}

async function getOneCourse(req, res) {
  const courseId = req.params.id;
  const response = await courseService.getASpecificCourse(courseId);

  if (response) {
    console.log("Course found.");
    res.render("courses/addOrEdit", {
      viewTitle: "Update Course",
      user: response
    });
  } else {
    console.log("User not found.");
  }
}

async function createNewCourse(req, res) {
  const response = await courseService.addCourse(req.body);
  if (response) {
    res.redirect("/api/course/list");
  } else {
    console.log("Error during record insertion");
  }
}

async function modifyCourse(req, res) {
  const courseId = req.params.id;
  const response = await courseService.updateCourse(courseId, req.body);

  if (response) {
    console.log("Course found.");
    res.render("courses/addOrEdit", {
      viewTitle: "Modify Course",
      user: response
    });
  } else {
    console.log("Course not found.");
  }
}

async function deleteCourse(req, res) {
  const response = await courseService.deleteCourse(req.body);
  if (response) {
    res.redirect("/api/course/list");
  } else {
    console.log("Error on removing course");
  }
}

//---------------------------------------------------COURSE CRUD END -----------------------------------------------------------------

//---------------------------------------------------COURSE ENROLLMENT ---------------------------------------------------------------

async function registerUserInCourse(req, res) {
  const response = await courseService.addCourse(req.body);
  if (response) {
    res.redirect("/api/course/list");
  } else {
    console.log("Error during record insertion");
  }
}

async function removeUserInCourse(req, res) {
  const response = await courseService.addCourse(req.body);
  if (response) {
    res.redirect("/api/course/list");
  } else {
    console.log("Error during record insertion");
  }
}

//---------------------------------------------------COURSE ENROLLMENT END --------------------------------------------------------------

module.exports = {
  getCoursesList,
  getOneCourse,
  createNewCourse,
  modifyCourse,
  deleteCourse,
  registerUserInCourse,
  removeUserInCourse
};
