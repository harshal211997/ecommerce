const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const app = require("./app.js");
dotEnv.config({ path: "./config.env" });

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

//Creating server and listening on PORT
const port = process.env.PORT || 3000;
app.listen(port, "localhost", (err) => {
  if (!err) {
    console.log(`App started to listen on PORT ${port}`);
  }
});
