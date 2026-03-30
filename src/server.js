require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;
const seedUsers = require("./utils/seedUsers");
seedUsers();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
