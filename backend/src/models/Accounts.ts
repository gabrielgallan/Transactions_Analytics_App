import { randomUUID } from 'crypto';
import { User } from './User.ts';
import { Transaction } from './Transaction.ts';

export class Account {
    private a_id: string
    private user_id: string
    private holder: string
    private balance: number
    private type: string
    private transaction_password: string

    constructor( user: User ) {
        this.a_id = randomUUID()
        this.user_id = user.get_id
        this.holder = user.name
        this.balance = 0
        this.type = ''
        this.transaction_password = user.ReturnUserPassword()
    }

    //Getters
    get getBalance(): number {
        return this.balance
    }

    //Setters

    //Methods
    deposit(transaction: Transaction): void {
        this.balance += transaction.getAmount
    }

    withdraw(transaction: Transaction): void {
        if ( transaction.getAmount <= this.balance ) {
            this.balance -= transaction.getAmount
        } else {
            throw new Error('Não há saldo suficiente para esta transação')
        }
    }
}