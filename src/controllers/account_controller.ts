import AccountModel, { IAccount } from '../models/account_model'
import createController from './base_controller'

const AccountController = createController<IAccount>(AccountModel)

export default AccountController
