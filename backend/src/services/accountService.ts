import { Account } from '../models/Accounts.ts'
import { ReturnUserDataToOpenAccount, UserModel } from '../models/User.ts'
import { HttpError } from '../middlewares/ErrorHandlers.ts'
import { accountRepository } from '../repositories/accountRepository.ts'

async function createAccount(user: UserModel, password: string) {
  const UserData = ReturnUserDataToOpenAccount.authenticate(user, password)

  if (UserData !== 'unauthorized') {
    const account = Account.create(UserData)
    await accountRepository.insert(account)
  } else {
    throw new HttpError(500, 'Erro interno de autorização')
  }
}

async function listAccounts() {
  const rawAccounts: Account[] = await accountRepository.selectAll()

  if (rawAccounts) 
    return rawAccounts.map((account) => Account.import(account).public_data())
  else 
    throw new HttpError(404, 'Não foi possível encontrar as contas')
  
}

async function selectAccountById(uuid: string) {
  const rawAccount: Account | null = await accountRepository.findById(uuid)

  if (rawAccount)
    return Account.import(rawAccount).public_data()
  else
    throw new HttpError(404, 'Conta não encontrada')  
}

export const accountService = {
  createAccount,
  listAccounts,
  selectAccountById,
}
