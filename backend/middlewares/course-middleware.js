function validateAllBodyAttributes(req, res, next) {
  const { name } = req.body;

  let errors = "";
  if (!name) {
    console.log("Incomplete/Wrong Fields");
    return res.redirect("/api/users");
  }
  next();
}

module.exports = {
  validateAllBodyAttributes
};
