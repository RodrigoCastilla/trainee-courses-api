const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Course = mongoose.model("Course");

//
router.get("/", (req, res) => {
  Course.find((err, docs) => {
    if (!err) {
      // res.render("courses/list", {
      //   list: docs
      // });
      res.json(docs);
    } else {
      console.log("Error retrieving user list: " + err);
    }
  });
});

router.get("/test/:name", (req, res) => {
  insertCourse(req, res);
});

function insertCourse(req, res) {
  const course = new Course();
  course.name = req.params.name;
  // course.enrolledCourses = [];
  course.save((err, doc) => {
    if (!err) res.redirect("/api/course/list");
    else {
      console.log("Error during record insertion: " + err);
    }
  });
}

router.get("/list", (req, res) => {
  res.json("from list");
});

function insertRecord() {}

module.exports = router;
