//Importing express midleware
const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./router/userRouter.js");
const categoriesRouter = require("./router/categorieRouter.js");
const globalErrorHandler = require("./controller/errorController.js");

//
app.use(cors());
//request bosy parser middleware
app.use(express.json());

//Routing Middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoriesRouter);

//Global error handler
app.use(globalErrorHandler);
//exporting app
module.exports = app;
