const courseService = require("../services/course-service");

const userList = [];

const getAllUsers = () => {
  return userList;
};

const addUser = user => {
  userList.push(user);
};

const updateUser = (oldUser, newUser) => {
  // predicate: true | false
  const index = userList.findIndex(un => oldUser === un);
  userList[index] = newUser;
};

const deleteUser = user => {
  const index = userList.findIndex(un => user === un);
  userList.splice(index, 1);
};

const registerUserInCourse = () => {
  
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  registerUserInCourse
};
