const express = require("express");
const router = express.Router();

//const {homePage,loginPage,processLogin,signupPage,processSignup,logoutPage} = require("../controllers/user");

const {homePage,loginPage,processLogin,signupPage,processSignup,logoutPage,razor,processRazor,change_pass,processChange_pass,my_account,deleteAccount} = require("../controllers/user");

router.get("/home",homePage); // Home page

router.get("/",loginPage); // Login page

router.get("/login",loginPage); // Login page

router.post("/login",processLogin); // Process login

router.get("/signup",signupPage); // Signup page

router.post("/signup",processSignup); // Process signup

router.get("/logout",logoutPage); // Logout

router.get("/razor",razor); // XSS page

//router.post("/razor",processRazor); // XSS process

router.get("/razorf",processRazor); // XSS process

router.get("/change_pass",change_pass); // CSRF page

router.post("/change_pass",processChange_pass); // CSRF process

router.get("/my_account",my_account); // my_account

router.post("/my_account",deleteAccount); // account_delete

module.exports = router;

// process has POST method 

// only show has GET method

// module.exports = router; means this is exportable by any other files
