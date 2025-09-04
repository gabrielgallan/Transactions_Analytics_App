import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"
import { User, UserData } from "../models/User.ts"
import { HttpError } from "../models/HttpErrors.ts"

async function createAccount(user: User, password: string) {
    user.authenticate(password)
    const t_pass = user.password_hash

    user.authenticate(password)
    const data = user.public_data()
    const account = new Account(data?.name, data?.id, t_pass)
    database.insert('accounts', account)
}

//Ajustar
async function listAccounts() {
    const rawAccounts: Account[] = database.select('accounts').all()

    if ( rawAccounts ) {
        const accounts = rawAccounts.map((account) => {
            return Account.import(account).public_data()
        }) 
        return accounts
    } else {
        throw new HttpError(404, 'Não foi possível encontrar as contas')
    }
}

/*//Refazer
async function buscarContaPeloId( uuid: string ) {
    const account: Account = database.select_where('accounts', 'id', uuid)
    if ( account ) {
        return account
    } else {
        throw { code: 404, message: 'Account not found' }
    }
}*/

export const accountService = {
    createAccount,
    listAccounts
}