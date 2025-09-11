import { randomUUID } from 'crypto'
import { Transaction } from './Transaction.ts'
import { UserModel } from './User.ts'

interface PublicAccountSchema {
  id: string
  user_id: string
  holder: string
  balance: number
  type: string | null
}

type RequestUserData = Pick<UserModel, 'name' | 'id' | 'password'>

export class Account {
  private id: string
  private user_id: string
  private holder: string
  private balance: number
  private type: string | null
  private transaction_password: string
  private created_at: string

  private constructor( UserData: RequestUserData ) {
    this.id = randomUUID()
    this.user_id = UserData.id
    this.holder = UserData.name
    this.balance = 0
    this.type = null
    this.transaction_password = UserData.password
    this.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19)
  }

  static import(json: any): Account {
    const instance = Object.create(Account.prototype)
    const account: Account = Object.assign(instance, json)

    return account
  }

  static create( UserData: RequestUserData ): Account {
    return new Account(UserData)
  }

  // Getters
  get getBalance(): number {
    return this.balance
  }

  // Setters

  // Methods
  public_data(): PublicAccountSchema {
    return {
      id: this.id,
      user_id: this.user_id,
      holder: this.holder,
      balance: this.balance,
      type: this.type,
    }
  }

  deposit(transaction: Transaction): void {
    this.balance += transaction.public_data().amount
  }

  withdraw(transaction: Transaction): void {
    if (transaction.public_data().amount <= this.balance) {
      this.balance -= transaction.public_data().amount
    } else {
      throw new Error('Não há saldo suficiente para esta transação')
    }
  }
}
