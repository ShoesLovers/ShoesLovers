import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType> {
  model: Model<ModelType>;
  constructor(model: Model<ModelType>) {
    this.model = model;
  }
  async getAll(req: Request, res: Response) {
    console.log("getAll");
    try {
      const users = await this.model.find();
      res.status(200).send(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    console.log("getById:" + req.params.id);
    try {
      const user = await this.model.findById(req.params.id);
      res.status(200).send(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseController<ModelType>(model);
};
export default createController;
