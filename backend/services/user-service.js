const courseService = require("./course-service");
const tokenservice = require("./token-service");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const getAllUsers = async () => {
  const res = await User.find((err, docs) => {
    if (!err) {
      return docs;
    }
  });
  return res;
};

const getASpecificUser = async userId => {
  const res = await User.findById(
    { _id: userId },
    { lean: true },
    (err, doc) => {
      if (!err) {
        return doc;
      }
      //console.log(doc);
    }
  );
  return res;
};

const addUser = async newUser => {
  const user = new User();
  user.name = newUser.name;
  user.email = newUser.email;
  user.password = newUser.password;
  user.role = newUser.role;
  user.enrolledCourses = [];

  const res = await user.save((err, doc) => {
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

const updateUser = async (userId, userData) => {
  const res = await User.findOneAndUpdate(
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

const deleteUser = async userId => {
  const res = await User.findByIdAndRemove(userId, (err, doc) => {
    if (!err) {
      return true;
    } else {
      console.log("Error in user delete :" + err);
      return false;
    }
  });
  return res;
};

const registerCourseInUser = async (userID, courseId) => {
  //console.log(await courseService.getAllCourses());
  const course = await courseService.getASpecificCourse(courseId);

  const res = await User.findOneAndUpdate(
    { _id: userID },
    {
      $addToSet: {
        enrolledCourses: course
      }
    },
    { new: true }
  );
  console.log("c");
  console.log(res);
  if (res) {
    return true;
  }
  // return false;
  // console.log(resp);
  // return resp;
};

const removeCourseInUser = async (userId, courseName) => {
  const res = await User.findOneAndUpdate(
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
  return res;
};

async function logIn(email, password) {
  const user = await User.find({ email: email, password: password });
  if (user !== null && user) {
    return await tokenservice.encryptToken(user);
  }
  return false;
}

async function logOut() {
  return await tokenservice.deleteToken();
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
