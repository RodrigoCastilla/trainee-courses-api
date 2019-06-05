const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  //   id: {
  //     type: String
  //   },
  name: {
    type: String,
    required: "This field is required."
  }
});

// Custom validation for email
// courseSchema.path("email").validate(val => {
//   emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return emailRegex.test(val);
// }, "Invalid e-mail.");

mongoose.model("Course", courseSchema);
