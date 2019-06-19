function validateAllBodyAttributes(req, res, next) {
  const { name } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { role } = req.body;

  let errors = "";
  if (!name || !email || !password || !role) {
    console.log("Incomplete/Wrong Fields");
    return res.redirect("/api/users");
  }
  next();
}

module.exports = {
  validateAllBodyAttributes
};
