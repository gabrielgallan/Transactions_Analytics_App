import { User } from '../models/User.ts'
import db from '../../database.ts';

class UserRepository {
  async insert(user: User): Promise<User> {
    const [newUser] = await db("users").insert(user).returning("*")
    return newUser
  }

  async findById(id: number): Promise<User | null> {
    const user = await db("users").where({ id }).first()
    return user ?? null
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const [updatedUser] = await db("users")
      .where({ id })
      .update(data)
      .returning("*")
    return updatedUser ?? null
  }

  async delete(id: number): Promise<boolean> {
    const rowsDeleted = await db("users").where({ id }).del()
    return rowsDeleted > 0
  }
}

// exportando instância já pronta
export const userRepository = new UserRepository()