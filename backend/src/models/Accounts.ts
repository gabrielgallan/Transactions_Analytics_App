import { randomUUID } from 'crypto';
import { User } from './User.ts';
import { Transaction } from './Transaction.ts';

interface PublicAccountSchema {
    id: string,
    user_id: string,
    holder: string,
    balance: number,
    type: string
}

export class Account {
    private id: string
    private user_id: string
    private holder: string
    private balance: number
    private type: string
    private transaction_password: string

    constructor(username: string, userID: string, t_password: string) {
        this.id = randomUUID()
        this.user_id = userID
        this.holder = username
        this.balance = 0
        this.type = ''
        this.transaction_password = t_password
    }

    //Getters
    get getBalance(): number {
        return this.balance
    }

    //Setters

    //Methods
    public_data(): PublicAccountSchema {
        return {
            id: this.id,
            user_id: this.user_id,
            holder: this.holder,
            balance: this.balance,
            type: this.type
        }
    }

    deposit(transaction: Transaction): void {
        this.balance += transaction.getAmount
    }

    withdraw(transaction: Transaction): void {
        if (transaction.getAmount <= this.balance) {
            this.balance -= transaction.getAmount
        } else {
            throw new Error('Não há saldo suficiente para esta transação')
        }
    }

    static import(json: any): Account {
        const instance = Object.create(Account.prototype)
        const account: Account = Object.assign(instance, json)

        return account
    }
}