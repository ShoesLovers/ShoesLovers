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
      res.status(201).send("OK");
    } catch (err) {
      console.log(err);
      res.status(406).send("fail: " + err.message);
    }
  }

  async updateById(req: Request, res: Response) {
    console.log("putStudent:" + req.body);
    try {
      await this.model.findByIdAndUpdate(req.params.id, req.body);
      const obj = await this.model.findById(req.params.id);
      res.status(200).send(obj);
    } catch (err) {
      console.log(err);
      res.status(406).send("fail: " + err.message);
    }
  }
  async deleteById(req: Request, res: Response) {
    console.log("deleteById:" + req.body);
    try {
      await this.model.findByIdAndDelete(req.params.id);
      res.status(200).send("OK");
    } catch (err) {
      console.log(err);
      res.status(406).send("fail: " + err.message);
    }
  }
}
const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseController<ModelType>(model);
};
export default createController;
