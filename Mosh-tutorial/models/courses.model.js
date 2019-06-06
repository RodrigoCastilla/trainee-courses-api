const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  //   id: {
  //     type: String
  //   },
  name: {
    type: String,
    required: "This field is required."
  }
  // enrolledUsers: [
  //   {
  //     _id: mongoose.Schema.Types.ObjectId,
  //     name: String,
  //     email: String,
  //     password: String,
  //     role: String,
  //     enrolledCourses: [
  //       {
  //         _id: mongoose.Schema.Types.ObjectId,
  //         name: String
  //       }
  //     ]
  //   }
  // ]
});

// Custom validation for email
// courseSchema.path("email").validate(val => {
//   emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return emailRegex.test(val);
// }, "Invalid e-mail.");

mongoose.model("Course", courseSchema);
