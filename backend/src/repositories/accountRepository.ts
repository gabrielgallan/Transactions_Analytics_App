import { Account } from '../models/Accounts.ts'
import db from '../../database.ts';
import { HttpError } from '../middlewares/ErrorHandlers.ts';

class AccountRepository {
  async selectAll(): Promise<Account[]> {
    const users = await db('accounts').select('*')
    return users
  }

  async insert(account: Account): Promise<Account> {
    const [newAccount] = await db("accounts").insert(account).returning("*")
    return newAccount
  }

  async findById(id: string): Promise<Account | null> {
    const account = await db("accounts").where({ id }).first()
    return account ?? null
  }

  async update(id: string, data: Partial<Account>): Promise<Account | null> {
    const [updatedAccount] = await db("accounts")
        .where({ id })
        .update(data)
        .returning("*")

    return updatedAccount ?? null
  }

  async delete(id: string): Promise<boolean> {
    const rowsDeleted = await db("accounts").where({ id }).del()
    return rowsDeleted > 0
  }
}

// exportando instância já pronta
export const accountRepository = new AccountRepository()