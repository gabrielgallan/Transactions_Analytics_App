import { Account } from "../models/Accounts"

export const accounts_db: Account[] = []

const listarContas = async () => {
    const accounts: Account[] = accounts_db

    if ( accounts ) {
        return accounts
    } else {
        throw ({ message: 'Não foi possível encontrar as contas' })
    }
}

export const accountService = {
    listarContas
}