import { Request, Response } from "express";
import Account from "../models/account_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  console.log("register");
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }
  try {
    const existAccount = await Account.findOne({ email: email });
    if (existAccount != null) {
      return res.status(400).send("user already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newAccount = await Account.create({
      email: email,
      password: encryptedPassword,
    });
    return res.status(201).send({ _id: newAccount._id });
  } catch (err) {
    return res.status(400).send("error missing email or password");
  }
};
const login = async (req: Request, res: Response) => {
  console.log("login");
  const email = req.body.email;
  const password = req.body.password;
  if (email == null || password == null) {
    return res.status(400).send("email or password is null");
  }
  try {
    const account = await Account.findOne({ email: email });
    if (account == null) {
      return res.status(400).send("user already exists");
    }
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).send("invalid password");
    }
    const accessToken = jwt.sign({ _id: account._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
    return res.status(200).send({ accessToken: accessToken });
  } catch (err) {
    return res.status(500).send("server error");
  }
};
const logout = async (req: Request, res: Response) => {
  console.log("logout");
  res.status(400).send("logout");
};

export default { login, logout, register };
