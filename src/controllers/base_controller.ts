import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<ModelType> {
  model: Model<ModelType>;
  constructor(model: Model<ModelType>) {
    this.model = model;
  }
  async getAll(req: Request, res: Response) {
    console.log("getAllUsers");
    try {
      if (req.query.name) {
        const user = await this.model.find({ name: req.query.name });
        res.send(user);
      } else {
        const user = await this.model.find();
        res.send(user);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    console.log("getUserById:" + req.params.id);
    try {
      const user = await this.model.findById(req.params.id);
      res.send(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async post(req: Request, res: Response) {
    console.log("postUser:" + req.body);
    try {
      await this.model.create(req.body);
      res.send("OK");
    } catch (err) {
      console.log(err);
      res.status(500).send("fail: " + err.message);
    }
  }

  async delete(req: Request, res: Response) {
    console.log("deleteUser");
    res.send("Test delete user!");
  }
  async update(req: Request, res: Response) {
    console.log("updateUser");
    res.send("Test update user!");
  }
}
export = BaseController;
