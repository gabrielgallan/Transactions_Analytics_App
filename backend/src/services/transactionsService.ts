import { database } from "../app.ts"
import { Transaction, TransactionData } from "../models/Transaction.ts"
import { accountService } from "./accountService.ts"

async function criarTransacao ( account_uuid: string, data: TransactionData ) {
    try {
        const account = await accountService.buscarContaPeloId( account_uuid )
        const transaction = new Transaction(account_uuid, data)

        switch (data.type) {
            case ('credit'):
                account.deposit(transaction)
                break
            case ('debit'):
                account.withdraw(transaction)
                break
            default:
                throw new Error('O tipo da transação não é válido')
        }
        
        database.insert('transactions', transaction)
        return transaction
    } catch (err: any) {
        throw new Error('Erro ao processar transação: ' + err.message)
    }
}

export const transactionService = {
    criarTransacao
}