import bcrypt from "bcryptjs";
import User from "../model/user.model.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ message: "All fields are required.", success: false });
    }
    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
      return res
        .status(400)
        .send({ message: "Email already exists.", success: false });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = User({ name: name, email: email, password: hashPassword });

    await user.save();
    res
      .status(201)
      .send({ message: "User Registered Successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in Registering user", success: false });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required.", success: false });
    }

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      return res
        .status(404)
        .json({ message: "Email not found.", success: false });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid Credentials.", success: false });
    }

    res.status(201).send({
      message: "User LoggedIn Successful",
      user: { userId: isUserExist._id, username: isUserExist.name },
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in Login User", success: false });
  }
};
