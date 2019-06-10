const localStorage = require("local-storage");
const jwt = require("jsonwebtoken");

function decryptToken(req, res) {
  const tokenResponse = jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      console.log("forbidden from login");
      res.sendStatus(403);
    } else {
      return authData;
    }
  });
  return tokenResponse;
}

function encryptToken(user) {
  const res = jwt.sign(
    { user: user },
    "secretKey" /*, {expiresIn: '30s'} */,
    (err, token) => {
      localStorage.set("userToken", JSON.stringify(token));
      return true;
    }
  );
  return res;
}

function deleteToken() {
  localStorage.remove("userToken");
  localStorage.clear();
  return localStorage.get("userToken") === null;
}

module.exports = {
  encryptToken,
  decryptToken,
  deleteToken
};
