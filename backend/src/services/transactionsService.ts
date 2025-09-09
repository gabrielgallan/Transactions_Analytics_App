import { database } from "../app.ts"
import { Transaction, TransactionData } from "../models/Transaction.ts"
import { accountService } from "./accountService.ts"
import { Account } from "../models/Accounts.ts"

async function createTransaction ( account_uuid: string, data: TransactionData ): Promise<Transaction> {
    try {
        const rawAccount: Account = database.select('accounts').where('id', account_uuid).first()
        const account: Account = Account.import(rawAccount)

        const transaction = new Transaction(account_uuid, data)

        switch (data.flow) {
            case ('input'):
                account.deposit(transaction)
                break
            case ('output'):
                account.withdraw(transaction)
                break
            default:
                throw new Error('O tipo da transação não é válido')
        }
        
        database.insert('transactions', transaction)
        database.update('accounts', account_uuid, account)
        return transaction
    } catch (err: any) {
        throw new Error('Erro ao processar transação: ' + err.message)
    }
}

async function listAccountTransactions ( uuid: string ) {
    try {
        const rawTransactions: Transaction[] = database.select('transactions').where('account_id', uuid).all()

        if ( rawTransactions ) {
            const transactions = rawTransactions.map((transaction) => {
                return Transaction.import(transaction).public_data()
            })

            return transactions
        } else {
            throw new Error('Não há transações para a conta informada')
        }
    } catch (err: any) {
        throw new Error('Erro ao buscar transações: ' + err.message)
    }
}

export const transactionServices = {
    createTransaction,
    listAccountTransactions
}