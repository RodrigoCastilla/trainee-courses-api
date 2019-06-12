const localStorage = require("local-storage");
const jwt = require("jsonwebtoken");

async function decryptToken(req, res) {
  const tokenResponse = await jwt.verify(
    req.token,
    "secretKey",
    (err, authData) => {
      if (err) {
        console.log("forbidden from login");
        res.sendStatus(403);
      } else {
        return authData;
      }
    }
  );
  return tokenResponse;
}

async function encryptToken(user) {
  const res = await jwt.sign(
    { user: user },
    "secretKey" /*, {expiresIn: '30s'} */,
    (err, token) => {
      localStorage.set("userToken", JSON.stringify(token));
      return true;
    }
  );
  return res;
}

async function deleteToken() {
  await localStorage.remove("userToken");
  await localStorage.clear();
  return (await localStorage.get("userToken")) === null;
}

module.exports = {
  encryptToken,
  decryptToken,
  deleteToken
};
