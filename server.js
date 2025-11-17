import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { verifyToken } from "./middleware/verifytoken.middleware.js";
import Product from "./model/product.model.js";
import mainRouter from "./routes/index.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your actual frontend origin
  credentials: true, // Crucial for allowing cookies
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

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

app.use("/api/v1", verifyToken, mainRouter);

app.get("/api/v1/test/operators", async (req, res) => {
  try {
    // Comparison Query Operators

    // const products = await Product.find({ brand: { $eq: "Nike" } });

    // const products = await Product.find({ category: { $ne: "Shoes" } });

    // const products = await Product.find({ price: { $gt: 500 } });

    // const products = await Product.find({ price: { $gte: 1000 } });

    // const products = await Product.find({ price: { $lt: 300 } });

    // const products = await Product.find({ price: { $lte: 500 } });

    // const products = await Product.find({
    //   category: { $in: ["Shoes", "Clothes"] },
    // });

    // const products = await Product.find({
    //   brand: { $nin: ["Nike", "Puma"] },
    // });

    // Logical Operators

    // const products = await Product.find({
    //   $and: [
    //     { brand: "Nike" },
    //     { price: { $gt: 500 } }
    //   ]
    // });

    // const products = await Product.find({
    //   $or: [
    //     { category: "Shoes" },
    //     { brand: "Adidas" }
    //   ]
    // });

    // const products = await Product.find({
    //   price: { $not: { $gt: 1000 } },
    // });

    // const products = await Product.find({
    //   $nor: [{ brand: "Nike" }, { category: "Electronics" }],
    // });

    // const products = await Product.find({
    //   stock: { $exists: true },
    // });

    const products = await Product.find({
      title: { $type: "string" },
    });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Hello Ramchandra Dalvi, Server Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
