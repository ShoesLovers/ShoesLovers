import { Request, Response } from "express";
import AccountModel from "../models/account_model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const login = async (req: Request, res: Response) => {
  console.log("login");
  const email = req.body.email;
  const password = req.body.password;
  if (email == null || password == null) {
    return res.status(400).send("email or password is null");
  }
  try {
    const account = await AccountModel.findOne({ email: email });
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
    res.status(200).send({ accessToken: accessToken });
    return res.status(200).send(account);
  } catch (err) {
    return res.status(500).send("server error");
  }
};
const logout = async (req: Request, res: Response) => {
  console.log("logout");
  res.status(400).send("logout");
};
const register = async (req: Request, res: Response) => {
  console.log("register");
  const email = req.body.email;
  const password = req.body.password;
  if (email == null || password == null) {
    return res.status(400).send("email or password is null");
  }
  try {
    const existAccount = await AccountModel.findOne({ email: email });
    if (existAccount != null) {
      return res.status(400).send("user already registrated");
    }
  } catch (err) {
    return res.status(400).send("server error");
  }
  try {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newAccount = await AccountModel.create({
      email: email,
      password: encryptedPassword,
    });
    return res.status(200).send(newAccount);
  } catch (err) {
    return res.status(500).send("fail registration");
  }
};

export default { login, logout, register };
