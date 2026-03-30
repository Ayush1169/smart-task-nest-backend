const User = require("../models/User.model");

const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.insertMany([
      { name: "Ayush", email: "ayush@test.com", role: "Developer" },
      { name: "Abhineet", email: "abhineet@test.com", role: "Designer" },
      { name: "Shivam", email: "shivam@test.com", role: "Tester" },
      { name: "Ariv", email: "ariv@test.com", role: "Manager" },
    ]);
    console.log("Dummy users added ✅");
  }
};

module.exports = seedUsers;
