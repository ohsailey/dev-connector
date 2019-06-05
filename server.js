const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const auth = require("./routes/api/auth");

const app = express();

const PORT = process.env.PORT || 5000;

// connect database
connectDB();

// Init middleware (原本是bodyparser，但express已經有打包好了)
app.use(express.json({ extended: false }));

// Set Route
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/auth", auth);

// Serve static assets in production 在Production版設置靜態檔案
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // Render client/build/index.html file whatever route is 無論路徑如何，都會載入index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
