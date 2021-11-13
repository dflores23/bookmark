//__________________________________
// DEPENDENCIES
//__________________________________
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from .env
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan");

//_________________________
// DATABASE CONNECTION
//_________________________
// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to Mongo"))
  .on("close", () => console.log("Your are disconnected from Mongo"))
  .on("error", (error) => console.log(error));

  // _________________________
  // Models & Schemas
  // _________________________
const BookmarkSchema = new mongoose.Schema ({
  title: String,
  url: String,
})

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

// _________________________
// Middleware
// _________________________
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

//_________________________
// ROUTES
//_________________________
//  test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// Index Route
app.get("/bookmark", async (req, res) => {
  try {
    res.json(await Bookmark.find());
  } catch (error) {
    res.json({ message: error });
  }
})

// Create Bookmark Route
app.post("/bookmark", async (req, res) => {
  try {
    const bookmark = await Bookmark.create(req.body);
    res.json(bookmark);
  } catch (error) {
    res.json({ message: error });
  } 
})

// Bookmark update route
app.put("/bookmark/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bookmark);
  } catch (error) {
    res.json({ message: error });
  }
})

// People delete route
app.delete("/bookmark/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
    res.json(bookmark);
  } catch (error) {
    res.json({ message: error });
  }
})

//_________________________
// LISTENER
//_________________________
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));