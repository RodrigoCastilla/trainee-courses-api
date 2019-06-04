const isValidCourse = (req, res, next) => {
    const { course } = req.body;
  
    if (!course.length) {
      return res.render("error", {
        message: "Course cannot be empty"
      });
    }
  
    next();
  };
  
  module.exports = {
    isValidCourse
  };
  