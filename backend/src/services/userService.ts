import { UserData, User, UserSchema, UpdateData } from "../models/User.ts"
import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"
import { HttpError } from "../models/HttpErrors.ts"
import { UpdateUserHandler } from "../middlewares/user_handlers.ts"
import { z } from "zod"

async function createUser(userdata: UserData) {
    try {
        const user = new User(userdata)
        const proccess = user.validate_process(database.select('users').data)
        database.insert('users', user)

        return proccess
    } catch (err) {
        throw err
    }
}

async function listUsers() {
    const rawUsers: User[] = database.select('users').data
    const users = rawUsers.map(user => {
        return User.import(user).public_data()
    })

    return users
}

async function selectUserById(uuid: string) {
    const rawUser: User = database.select('users').where('id', uuid).data[0]

    if (rawUser)
        return User.import(rawUser).public_data()
    else
        throw new HttpError(404, 'Usuário não encontrado')

}

async function deleteUserById(uuid: string) {
    try {
        const removed: User = await database.delete('users', uuid)

        return { status: 'success', user: User.import(removed).public_data() }
    } catch (err: any) {
        throw err
    }
}

async function updateUser(uuid: string, update: UpdateData) {
    try {
        const user: User = User.import(database.select('users').where('id', uuid).data[0])
        if (user.compare_pass(update.password) === 'success') {
            const data = await UpdateUserHandler(update, user, database.select('users').data)

            const updated = {
                ...user,
                ...data
            }

            const service = await database.update('users', uuid, updated)
            return User.import(service).public_data()
        } else {
            throw new HttpError(401, 'Não autorizado, senha incorreta')
        }
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