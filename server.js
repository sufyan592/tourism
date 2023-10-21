const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORTT || 8000;
require("./db/db");

app.listen(port, () => {
  console.log(`App is running on ${port} port.`);
});
