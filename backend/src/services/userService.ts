import { UserData, User, UserSchema } from "../models/User.ts"
import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"
import { HttpError } from "../models/HttpErrors.ts"
import { PutUserHandler } from "../utils/User.ts"

async function createUser(userdata: UserData) {
    try {
        const user = new User(userdata)
        const status = user.validate_process(database.select('users').data)
        database.insert('users', user)

        return { status, user }
    } catch (err) {
        throw err
    }
}

async function listUsers() {
    const users: User[] = database.select('users').data
    return users
}

async function selectUserById(uuid: string) {
    const user: User = database.select('users').where('id', uuid).data[0]

    if (user) 
        return user
    else 
        throw new HttpError(404, 'Usuário não encontrado')
    
}

async function deleteUserById(uuid: string) {
    try {
        const removed = await database.delete('users', uuid)

        return { status: 'success', user: removed }
    } catch (err: any) {
        throw err
    }
}

async function updateUser(uuid: string, updates: Partial<Omit<User, "name" | "age" | "cpf" | "id" >>) {
    try {
        const user: User = await selectUserById( uuid )
        const updated = {
            ...user,
            ...updates
        }

        return await database.update('users', uuid, updated)
    } catch (err: any) {
        throw err
    }
}

export const userService = {
    createUser,
    listUsers,
    selectUserById,
    deleteUserById,
    updateUser
}