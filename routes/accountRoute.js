// Needed Resources
const express = require("express");
const utilities = require("../utilities");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

// route to build account
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/registration", utilities.handleErrors(accountController.buildRegister));
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post("/login",regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManager))
router.get("/logout", utilities.handleErrors(accountController.accountLogout))
router.get("/update-account", utilities.handleErrors(accountController.buildUpdateAccount))
router.post("/update-account", regValidate.accountUpdateRules(), regValidate.checkUpdatedAccount, utilities.handleErrors(accountController.updateAccountInfo))
router.post("/changed-password", regValidate.changedPasswordRules(), regValidate.checkChangedPassword, utilities.handleErrors(accountController.changePassword))


module.exports = router;
