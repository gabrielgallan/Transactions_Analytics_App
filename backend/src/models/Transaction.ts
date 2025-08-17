import { randomUUID } from "crypto"


export class Transaction {
    private id: string
    private account_id: string
    private title: string
    private category: string
    private amount: number
    private type: string
    private date: string

    constructor( account: string, data: TransactionData ) {
        this.id = randomUUID()
        this.account_id = account
        this.title = data.title
        this.category = data.category
        this.amount = data.amount
        this.type = data.type
        this.date = (new Date()).toDateString()
    }

    get getType(): string {
        return this.type
    }

    get getAmount(): number {
        return this.amount
    }
}

export interface TransactionData {
        title: string
        category: string
        amount: number
        type: string
}