const localStorage = require("local-storage");
const jwt = require("jsonwebtoken");

//Format of Token
//Authorization: Bearer <acess_token>
//VerifyToken
function verifyToken(req, res, next) {
  const bearerHeader = JSON.parse(localStorage.get("userToken"));
  if (typeof bearerHeader !== null || typeof bearerHeader !== "undefined") {
    req.token = bearerHeader;
    next();
  } else {
    //Forbidden
    console.log("Forbidden from VerifyToken");
    res.sendStatus(403);
  }
  // const bearerHeader = JSON.parse(localStorage.get("userToken")); //req.headers["authorization"];
  // //Check if bearer is undefined
  // if (typeof bearerHeader !== null || typeof bearerHeader !== "undefined") {
  //   //aplit at the space
  //   //const bearer = bearerHeader.split(" ");
  //   //Get Token from array
  //   //const bearerToken = bearer[1];
  //   //Set the token
  //   // req.token = bearerToken;
  //   req.token = bearerHeader;
  //   //Next Middleware
  //   next();
  // } else {
  //   //Forbidden
  //   console.log("Forbidden from VerifyToken");
  //   res.sendStatus(403);
  // }
}

function verifyUser(req, res, next) {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      console.log("Forbidden from User Verify");
      res.sendStatus(403);
    } else {
      if (authData.user.role === "User" || authData.user.role === "Admin") {
        next();
      }
    }
  });
}

function verifyAdmin(req, res, next) {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      console.log("Forbidden from User Verify");
      res.sendStatus(403);
    } else {
      if (authData.user.role === "Admin") {
        next();
      }
    }
  });
}

module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin
};
