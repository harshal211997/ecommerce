const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

//routing techniques:
router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.post("/verifyEmail", authController.verifyEmail);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
