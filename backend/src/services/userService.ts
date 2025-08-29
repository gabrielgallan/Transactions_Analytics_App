import { UserData, User, UserSchema, UpdateData } from "../models/User.ts"
import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"
import { HttpError } from "../models/HttpErrors.ts"
import { UpdateUserHandler } from "../middlewares/user_handlers.ts"
import { z } from "zod"
import { ZodErrorHandler } from "../middlewares/zod_error_handler.ts"

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
    const rawUser: User = database.select('users').where('id', uuid).data[0]

    if (rawUser) 
        return User.import(rawUser)
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

async function updateUser(uuid: string, update: UpdateData) {
    try {
        const user: User = await selectUserById( uuid )
        const data = await UpdateUserHandler( update, user, database.select('users').data )

        const updated = {
            ...user,
            ...data
        }

        return await database.update('users', uuid, updated)
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            throw new HttpError(404, err.errors[0].message)
        }
        
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