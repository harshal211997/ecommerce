const fs = require("fs");
const mongoose = require("mongoose");
const Categorie = require("../module/categoriesModule.js");
const dotEnv = require("dotenv");

dotEnv.config({ path: "../config.env" });

//DB Connection:
const dbUrl = process.env.DATABASE_URL.replace(
  "<password>",
  encodeURIComponent(process.env.DATABASE_PASSWORD)
);
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("DB Connection Sucessfull!");
  })
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });

//READ FILE:
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Categorie.create(categories);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
};

importData();
