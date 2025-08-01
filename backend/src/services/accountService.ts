import { Account } from "../models/Accounts"
import { database } from "../app"

const listarContas = async () => {
    const accounts: Account[] = database.select('accounts')

    if ( accounts ) {
        return accounts
    } else {
        throw ({ message: 'Não foi possível encontrar as contas' })
    }
}

export const accountService = {
    listarContas
}