import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());

const users = [];

app.get("/", (req, res) => {
  res.send(`Hey hello, I'm ${process.env.MYNAME}, Welcome to Express Server!`);
});

app.get("/name", (req, res) => {
  res.send("Hello, I'm Ramchandra Dalvi");
});

app.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.send("All fields are required");
      return;
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      res.send("User already exists");
      return;
    }

    users.push({ name, email, password });
    res.send("Registered successfully");
  } catch (err) {
    console.error(err);
  }
});

app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.send("Email and password are required");
      return;
    }

    const existingUser = users.find((u) => u.email === email);
    if (!existingUser || existingUser.password !== password) {
      res.send("Invalid credentials");
      return;
    }

    res.send("Login successfully");
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  console.log("Server is listening on http://localhost:3000");
});
