import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send(`Hey hello, I'm ${process.env.MYNAME}, Welcome to Express Server!`);
});

app.get("/name", (req, res) => {
  res.send("Hello, I'm Ramchandra Dalvi");
});

app.listen(8000, () => {
  console.log("Server is listening on http://localhost:8000");
});
