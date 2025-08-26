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
/*
async function buscarUsuarioPeloId(uuid: string) {
    const user: User = database.select_where('users', 'id', uuid)
    if (user) {
        return user
    } else {
        throw { code: 404, message: 'User not found' }
    }
}

//Refazer
async function deletarUsuarioPeloId(uuid: string) {
    try {
        return await database.delete('users', 'id', uuid)
    } catch (err: any) {
        if (err instanceof HttpError) {
            throw err
        } else {
            throw new Error('Erro desconhecido')
        }
    }
}

//Refazer
async function atualizarUsuario(uuid: string, body: any) {
    try {
        const user: User = await buscarUsuarioPeloId(uuid)
        const SetRequest = PutUserHandler(body.type, body.data, user)

        return await database.update('users', uuid, user)
    } catch (err: any) {
        throw { message: err.message, code: err.code || 500 }
    }
}*/

export const userService = {
    createUser,
    listUsers
}