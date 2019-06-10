const courseService = require("../services/course-service");
const tokenservice = require("../services/token-service");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Course = mongoose.model("Course");

const getAllUsers = () => {
  const res = User.find((err, docs) => {
    if (!err) {
      return docs;
    } else {
      console.log("Error retrieving user list: " + err);
      return null;
    }
  });
  return res;
};

const getASpecificUser = userId => {
  const res = User.findById(userId, (err, doc) => {
    if (!err) {
      return doc;
    }
  });
  return res;
};

const addUser = newUser => {
  const user = new User();
  user.name = newUser.name;
  user.email = newUser.email;
  user.password = newUser.password;
  user.role = newUser.role;
  user.enrolledCourses = [];

  const res = user.save((err, doc) => {
    if (!err) {
      console.log("User Created");
      return true;
    } else {
      console.log("Error during record insertion: " + err);
      return false;
    }
  });
  return res;
};

const updateUser = (userId, userData) => {
  const res = User.findOneAndUpdate(
    { _id: userId },
    userData,
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

const deleteUser = userId => {
  User.findByIdAndRemove(userId, (err, doc) => {
    if (!err) {
      return true;
    } else {
      console.log("Error in user delete :" + err);
      return false;
    }
  });
};

const registerCourseInUser = (userID, courseId) => {
  const course = courseService.getASpecificCourse(courseId);
  User.findOneAndUpdate(
    { id: userID },
    {
      $addToSet: {
        enrolledCourses: course
      }
    },
    { new: true },
    (err, doc) => {
      if (!err) {
        return true;
      } else {
        return false;
      }
    }
  );
};

const removeCourseInUser = (user, courseName) => {
  User.findOneAndUpdate(
    { id: user.id },
    {
      $pull: { enrolledCourses: { name: courseName } }
    },
    { new: true },
    (err, doc) => {
      if (!err) {
        return true;
      } else {
        return false;
      }
    }
  );
};

function logIn(email, password) {
  const res = User.find({ email: email, password: password }, (err, data) => {
    if (err) {
      return false;
    }
    // console.log(data);
    const name = data[0].name;
    const role = data[0].role;
    const user = {
      name: name,
      email: email,
      role: role
    };
    return tokenservice.encryptToken(user);
  });
  return res;
}

function logOut() {
  return tokenservice.deleteToken();
}

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "name":
        body["fullNameError"] = err.errors[field].message;
      case "email":
        body["emailError"] = err.errors[field].message;
      case "password":
        body["password"] = err.errors[field].message;
      case "role":
        body["role"] = err.errors[field].message;
    }
  }
}

module.exports = {
  getAllUsers,
  getASpecificUser,
  addUser,
  updateUser,
  deleteUser,
  registerCourseInUser,
  removeCourseInUser,
  logIn,
  logOut
};
