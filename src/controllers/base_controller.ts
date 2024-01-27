import { Request, Response } from "express";

class base_controller {
  async getAllUsers(req: Request, res: Response) {
    console.log("getAllUsers");
    try {
      if (req.query.name) {
        const user = await User.find({ name: req.query.name });
        res.send(user);
      } else {
        const user = await User.find();
        res.send(user);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
export = base_controller;
