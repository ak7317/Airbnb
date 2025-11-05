const express = require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");


// renderSignup form
router.get("/signup", userController.renderSignupForm);
//Signup
router.post("/signup", wrapAsync(userController.signUp)
);

//render Login Form
router.get("/login",userController.renderLoginForm);

//Login
router.post(
  "/login",
   saveRedirectUrl,
   passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), 
  userController.login
 );

 // Logout 
  router.get("/logout", userController.logout);

module.exports = router;