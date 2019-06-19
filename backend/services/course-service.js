const userService = require("./user-service");
const mongoose = require("mongoose");
const Course = mongoose.model("Course");

const getAllCourses = async () => {
  const res = await Course.find((err, docs) => {
    if (!err) {
      return docs;
    } else {
      console.log("Error retrieving user list: " + err);
      return;
    }
  });
  return res;
};

const getASpecificCourse = async courseId => {
  console.log("Searching Course...");

  try {
    const res = await Course.findOne({ _id: courseId }, (err, doc) => {
      if (!err) {
        console.log("Course was found");
        return doc;
      }
      // throw error;
      console.log("Error");
    });
    return res;
  } catch (err) {
    console.log("From course finding:");
    console.log(err);
  }
  // const res = await Course.findOne({ _id: courseId }, (err, doc) => {
  //   if (!err) {
  //     console.log("Course was found");
  //     return doc;
  //   }
  //   console.log("Error");
  // });
};

const addCourse = async newCourse => {
  const course = new Course();
  course.name = newCourse.name;
  course.enrolledUsers = [];

  const res = await course.save((err, doc) => {
    if (!err) {
      return true;
    } else {
      console.log("Error during record insertion in DB: " + err);
      return false;
    }
  });
  console.log(res);
  return res;
};

const updateCourse = async (courseId, courseData) => {
  const res = await Course.findOneAndUpdate(
    { _id: courseId },
    courseData,
    { new: true },
    (err, doc) => {
      if (!err) {
        console.log("Course Updated");
        console.log(doc);
        return true;
      } else {
        console.log("Error during record update : " + err);
        return false;
      }
    }
  );
  return res;
};

const deleteCourse = async courseId => {
  const res = await User.findByIdAndRemove(courseId, (err, doc) => {
    if (!err) {
      return true;
    } else {
      console.log("Error in user delete :" + err);
      return false;
    }
  });
  return res;
};

const addUserInCourse = async (courseId, uerId) => {
  const user = await userService.getASpecificUser(uerId);
  const res = await Course.findOneAndUpdate(
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
  return res;
};

const removeUserInCourse = async (courseId, userId) => {
  const res = await User.findOneAndUpdate(
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
