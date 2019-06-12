const express = require("express");
const router = express.Router();
const courseService = require("../services/course-service");

//
router.get("/", async (req, res) => {
  const courses = await courseService.getAllCourses();
  if (courses) {
    res.json(docs);
  } else {
    console.log("Error retrieving courses list");
  }
});

router.get("/register/:name", async (req, res) => {
  const response = await courseService.addCourse(req.body);
  if (response) {
    res.redirect("/api/course/list");
  } else {
    console.log("Error during record insertion: " + err);
  }
});

router.get("/list", (req, res) => {
  res.json("from list");
});

function insertRecord() {}

module.exports = router;
