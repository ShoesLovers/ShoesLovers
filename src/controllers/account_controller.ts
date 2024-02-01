import AccountModel, { IAccount } from '../models/accountModel'
import createController from './base_controller'

const AccountController = createController<IAccount>(AccountModel)

export default AccountController
