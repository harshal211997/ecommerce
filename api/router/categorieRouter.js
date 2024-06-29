const express = require("express");
const router = express.Router();
const categoriesController = require("../controller/categoriesController.js");
const authController = require("../controller/authController.js");

//Protect Route:
router.use(authController.protect);

//Ctaegories Route:
router.get("/getCategories", categoriesController.getCategories);

module.exports = router;
