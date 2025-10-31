import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import mainRouter from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());

let users = [
  {
    id: 1,
    name: "Ramchandra",
    email: "rdalvi1210@gmail.com",
    password: "1234",
  },
];

app.get("/", (req, res) => {
  res.send(`Hey hello, I'm ${process.env.MYNAME}, Welcome to Express Server!`);
});

app.get("/name", (req, res) => {
  res.send("Hello, I'm Ramchandra Dalvi");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.send("All fields are required");
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.send("User already exists");
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
  };

  users.push(newUser);
  res.send("Registered successfully");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Email and password are required");
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.send("Invalid credentials");
  }

  res.send("Login successful");
});

app.get("/getuser/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id == id);

  if (!user) {
    return res.send("User not found");
  }

  res.send(user);
});

app.delete("/deleteuser/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id == id);

  if (!user) {
    return res.send("User not found");
  }

  users = users.filter((u) => u.id != id);
  res.send("User deleted successfully");
});

app.put("/edituser/:id", (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  const user = users.find((u) => u.id == id);

  if (!user) {
    return res.send("User not found");
  }

  if (email) user.email = email;
  if (password) user.password = password;

  res.status(200).json({
    message: "User updated successfully",
    users,
  });
});

app.use("/api/v1", mainRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Hello Rushikesh Arote, Server Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.listen(3000, () => {
  console.log("Server is running on http://localhost:8000");
});
