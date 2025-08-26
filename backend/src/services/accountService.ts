import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"

//Ajustar
async function listarContas() {
    const accounts: Account[] = database.select('accounts')

    if ( accounts ) {
        return accounts
    } else {
        throw ({ message: 'Não foi possível encontrar as contas' })
    }
}

//Refazer
async function buscarContaPeloId( uuid: string ) {
    const account: Account = database.select_where('accounts', 'id', uuid)
    if ( account ) {
        return account
    } else {
        throw { code: 404, message: 'Account not found' }
    }
}

export const accountService = {
    listarContas,
    buscarContaPeloId
}