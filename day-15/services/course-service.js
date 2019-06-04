const courseList = [
  {id: 1, courseName: 'course1'},
  {id: 2, courseName: 'course2'},
  {id: 3, courseName: 'course3'}
];

const getAllCourses = () => {
  return courseList;
};

const addCourse = course => {
  courseList.push(course);
};

const updateCourse = (oldCourse, newCourse) => {
  // predicate: true | false
  const index = courseList.findIndex(un => oldCourse === un);
  courseList[index] = newCourse;
};

const deleteCourse = course => {
  const index = courseList.findIndex(un => course === un);
  courseList.splice(index, 1);
};


module.exports = {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse
};