const courseService = require("../services/course-service");

const userList = [
  {id:1, name: "Rodrigo", email: "armc3po@gmail.com", password: "Admin123", role: "Admin", enrolledCourses: []},
  {id:2, name: "Groot", email: "iamgrood@gmail.com", password: "User123", role: "User", enrolledCourses: []}
];

const getAllUsers = () => {
  return userList;
};

const getASpecificUser = (name) => {
  return userList.find(userElem => userElem.name === name);;
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

const registerCourseInUser = (userName, course) => {
  const userIndex = userList.findIndex(userElem => userElem.name === userName);
  userList[userIndex].enrolledCourses.push(course);
};

const removeCourseInUser = (user, courseIndex) =>{
  const courseIndex = user.enrolledCourses.findIndex(
    courseElem => courseElem.courseName === courseName
  );
  if(courseIndex !== -1)
      user.enrolledCourses.splice(courseIndex, 1);
};

module.exports = {
  getAllUsers,
  getASpecificUser,
  addUser,
  updateUser,
  deleteUser,
  registerCourseInUser,
  removeCourseInUser
};
