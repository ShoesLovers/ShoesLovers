import User from "../models/user_model";
import { Request, Response } from "express";

const getUserById = async (req: Request, res: Response) => {
  console.log("getUserById:" + req.params.id);
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const postUser = async (req: Request, res: Response) => {
  console.log("postUser:" + req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("fail: " + err.message);
  }
};

const deleteUser = (req: Request, res: Response) => {
  console.log("deleteUser");
  res.send("Test delete user!");
};
const updateUser = (req: Request, res: Response) => {
  console.log("updateUser");
  res.send("Test update user!");
};

export = {
  getAllUsers,
  getUserById,
  postUser,
  deleteUser,
  updateUser,
};
