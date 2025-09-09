import { randomUUID } from "crypto"
import { z } from "zod"


export class Transaction {
    private id: string
    private account_id: string
    private title: string
    private category: string
    private amount: number
    private type: string
    private date: string
    private flow: string

    constructor(account: string, data: TransactionData) {
        this.id = randomUUID()
        this.account_id = account
        this.title = data.title
        this.category = data.category
        this.amount = data.amount
        this.type = data.type
        this.date = (new Date()).toDateString()
        this.flow = data.flow
    }

    public_data(): PublicTransactionSchema {
        return {
            id: this.id,
            account_id: this.account_id,
            title: this.title,
            category: this.category,
            amount: this.amount,
            type: this.type,
            date: this.date
        }
    }

    static import(json: any): Transaction {
        const instance = Object.create(Transaction.prototype)
        const transaction: Transaction = Object.assign(instance, json)

        return transaction
    }
}

export interface TransactionData {
    title: string
    category: string
    amount: number
    type: string
    flow: string
}

export const TransactionSchema = z.object({
    title: z.string().nonempty({ message: "Título da transação inválido" }),
    category: z.string().nonempty({ message: "Categoria inválida" }),
    amount: z.number(),
    type: z.enum(["credit", "debit", "pix"], {
        required_error: "Tipo é obrigatório",
        invalid_type_error: "Tipo inválido"
    }),
    flow: z.enum(["input", "output"], {
        required_error: "Movimentação é obrigatória",
        invalid_type_error: "Movimentação inválida"
    })
})

interface PublicTransactionSchema {
    id: string,
    account_id: string,
    title: string,
    category: string,
    amount: number,
    type: string,
    date: string
}