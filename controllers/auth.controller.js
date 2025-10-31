import User from "../model/user.model.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
      return res.status(400).send({ message: "Email already exists." });
    }
    const user = User({ email: email, password: password });

    await user.save();
    res.status(201).send({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error in Registering user" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found." });
    }

    if (isUserExist.password !== password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    res.status(201).send({ message: "User LoggedIn Successful" });
  } catch (error) {
    res.status(500).json({ message: "Error in Login User" });
  }
};
