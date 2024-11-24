require("dotenv").config();
const config = require("./config.json");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken"); // Corrected the inconsistency
const bcrypt = require("bcrypt"); // To hash passwords
const { authenticateToken } = require("./utilities.js");
const User = require("./models/user-model");
const Note = require("./models/note.model");

// Connect to MongoDB
mongoose
  .connect(config.connectionDB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

app.get("/", (req, res) => res.send("Hello World!"));

// Create an account

app.post("/create-account", async (req, res) => {
  // Create a new user
  const { username, email, password } = req.body;
  if (!username) {
    return res.status(400).send("Username is required");
  }
  if (!email) {
    return res.status(400).send("Email is required");
  }
  if (!password) {
    return res.status(400).send("Password is required");
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).send("User already exists");
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  res.json({
    user,
    accessToken,
    message: "User created successfully",
  });
});

// Login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate Input
  if (!email) {
    return res.status(400).send("Email is required");
  }
  if (!password) {
    return res.status(400).send("Password is required");
  }

  try {
    // Step 2: Find User by Email
    const userinfo = await User.findOne({ email });
    if (!userinfo) {
      return res.status(400).send("User not found");
    }

    // Step 3: Compare Entered Password with Stored Hashed Password
    const isPasswordValid = await bcrypt.compare(password, userinfo.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    // Step 4: Generate JWT Token (Include only necessary data)
    const accessToken = jwt.sign(
      { _id: userinfo._id, email: userinfo.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "36000m" }
    );

    // Step 5: Send Response
    res.json({
      userinfo: { _id: userinfo._id, email: userinfo.email },
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Get User

app.get("/getUser", authenticateToken, async (req, res) => {
  const user = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.status(400).send("User not found");
  }
  return res.json({
    username: isUser.username,
    email: isUser.email,
    password: isUser.password,
    createdAt: isUser.createdAt,
    id: isUser._id,
  });
});
// Get All Notes

app.get("/getNotes", authenticateToken, async (req, res) => {
  const user = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json(notes);
  } catch {
    return res.status(500).send("Server error");
  }
});

// Add a Note

app.post("/addNote", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.user;
  console.log("lil bro", user);
  if (!title) {
    return res.status(400).send("Title is required");
  }
  if (!content) {
    return res.status(400).send("Content is required");
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });
    await note.save();
    res.json(note);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
});

// Update a Note

app.put("/updateNote/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { title, content, tags, isPinned } = req.body;
  const user = req.user;
  if (!title && !content && !tags) {
    return res.status(400).send("Nothing to update");
  }
  try {
    const note = await Note.findById({ _id: id, userId: user._id });
    if (!note) {
      return res.status(404).send("Note not found");
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;
    await note.save();
    res.json(note);
  } catch {
    return res.status(500).send("Server error");
  }
});

// Delete a Note

app.delete("/deleteNote/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  try {
    const note = await Note.findByIdAndDelete({ _id: id, userId: user._id });
    if (!note) {
      return res.status(404).send("Note not found");
    }
    await note.deleteOne({ _id: id, userId: user._id });
    return res.status(200).send("Note deleted successfully");
  } catch {
    return res.status(500).send("Server error");
  }
});

// Update isPinned

app.put("/update-pinned-note/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { isPinned } = req.body;
  const user = req.user;

  try {
    const note = await Note.findById({ _id: id, userId: user._id });
    if (!note) {
      return res.status(404).send("Note not found");
    }

    if (isPinned) note.isPinned = isPinned || false;
    await note.save();
    res.json(note);
    console.log(user);
  } catch {
    return res.status(500).send("Server error");
  }
});

// Search Notes

app.get("/searchNotes/", authenticateToken, async (req, res) => {
  const user = req.user;
  const { query } = req.query; // Extract the query parameter

  if (!query) {
    return res.status(400).send("Query is required");
  }

  if (!user || !user._id) {
    return res.status(401).send("Authentication failed");
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json(matchingNotes);
  } catch (e) {
    console.error(e); // Log the error for debugging
    return res.status(500).send("Server error");
  }
});

module.exports = app;
