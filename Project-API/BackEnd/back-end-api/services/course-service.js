const userService = require("./user-service");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Course = mongoose.model("Course");

const getAllCourses = () => {
  const res = Course.find((err, docs) => {
    if (!err) {
      return docs;
    } else {
      console.log("Error retrieving user list: " + err);
      return null;
    }
  });
  return res;
};

const getASpecificCourse = courseId => {
  const res = Course.findById(courseId, (err, doc) => {
    if (!err) {
      return doc;
    }
  });
  return res;
};

const addCourse = newCourse => {
  const course = new Course();
  course.name = newCourse.name;
  course.enrolledUsers = [];
  course.save((err, doc) => {
    if (!err) {
      return true;
    } else {
      console.log("Error during record insertion: " + err);
      return false;
    }
  });
};

const updateCourse = (courseId, courseData) => {
  const res = Course.findOneAndUpdate(
    { id: courseId },
    courseData,
    { new: true },
    (err, doc) => {
      if (!err) {
        return true;
      } else {
        console.log("Error during record update : " + err);
        return false;
      }
    }
  );
  return res;
};

const deleteCourse = courseId => {
  User.findByIdAndRemove(courseId, (err, doc) => {
    if (!err) {
      return true;
    } else {
      console.log("Error in user delete :" + err);
      return false;
    }
  });
};

const addUserInCourse = (courseId, uerId) => {
  const user = userService.getASpecificUser(uerId);
  Course.findOneAndUpdate(
    { id: courseId },
    {
      $addToSet: {
        enrolledUsers: user
      }
    },
    { new: true },
    (err, doc) => {
      if (!err) {
        return true;
      } else {
        console.log("Error during record update : " + err);
        return false;
      }
    }
  );
};

const removeUserInCourse = (courseId, userId) => {
  const res = User.findOneAndUpdate(
    { id: courseId },
    {
      $pull: { enrolledCourses: { id: userId } }
    },
    { new: true },
    (err, doc) => {
      if (!err) {
        return true;
      } else {
        console.log("Error during record update : " + err);
        return false;
      }
    }
  );
  return res;
};

module.exports = {
  getAllCourses,
  getASpecificCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  addUserInCourse,
  removeUserInCourse
};
