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
