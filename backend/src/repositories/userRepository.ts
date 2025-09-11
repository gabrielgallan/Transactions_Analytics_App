import { User, UserModel } from '../models/User.ts'
import db from '../../database.ts';
import { HttpError } from '../middlewares/ErrorHandlers.ts';

class UserRepository {
  async selectAll(): Promise<User[]> {
    const users = await db('users').select('*')
    return users
  }

  async insert(user: User): Promise<User> {
    try {
      const [newUser] = await db("users").insert(user).returning("*")
      return newUser
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT" || err.code === "23505") {
        // SQLITE_CONSTRAINT para SQLite, 23505 para Postgres
        throw new HttpError(409, "Email ou CPF já cadastrado")
      }
      throw err
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await db("users").where({ id }).first()
    return user ?? null
  }

  async update(id: string, data: Partial<UserModel>): Promise<User | null> {
    try {
      const [updatedUser] = await db("users")
        .where({ id })
        .update(data)
        .returning("*")

      return updatedUser ?? null
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT" || err.code === "23505") {
        // 23505 = Postgres unique violation
        throw new HttpError(409, "Email ou CPF já cadastrado")
      }
      throw err
    }
  }

  async delete(id: string): Promise<boolean> {
    const rowsDeleted = await db("users").where({ id }).del()
    return rowsDeleted > 0
  }
}

// exportando instância já pronta
export const userRepository = new UserRepository()