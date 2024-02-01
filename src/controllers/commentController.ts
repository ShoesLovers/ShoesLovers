import { Request, Response } from 'express'
import { commentModel, IComment } from '../models/commentModel'
import { BaseController } from './base_controller'

class commentController extends BaseController<IComment> {
  constructor() {
    super(commentModel)
  }
  // TODO: Implement the following methods:
  // async getAll(req: Request, res: Response): Promise<void> {}
  // async getById(req: Request, res: Response): Promise<void> {}
  // async post(req: Request, res: Response): Promise<void> {}
  // async updateById(req: Request, res: Response): Promise<void> {}
  // async deleteById(req: Request, res: Response): Promise<void> {}
}

export default new commentController()
