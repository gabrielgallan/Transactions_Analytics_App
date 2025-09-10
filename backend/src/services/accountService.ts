import { Account } from '../models/Accounts.ts'
import { database } from '../app.ts'
import { User } from '../models/User.ts'
import { HttpError } from '../middlewares/errorHandlers.ts'

async function createAccount(user: User, password: string) {
  user.authenticate(password)
  const t_pass = user.password_hash

  user.authenticate(password)
  const data = user.public_data()
  const account = new Account(data?.name, data?.id, t_pass)
  database.insert('accounts', account)
}

async function listAccounts() {
  const rawAccounts: Account[] = database.select('accounts').all()

  if (rawAccounts) {
    const accounts = rawAccounts.map((account) => {
      return Account.import(account).public_data()
    })
    return accounts
  } else {
    throw new HttpError(404, 'Não foi possível encontrar as contas')
  }
}

async function selectAccountById(uuid: string) {
  const rawAccount: Account = database
    .select('accounts')
    .where('id', uuid)
    .first()

  if (rawAccount) {
    return Account.import(rawAccount).public_data()
  } else {
    throw new HttpError(404, 'Conta não encontrada')
  }
}

export const accountService = {
  createAccount,
  listAccounts,
  selectAccountById,
}
