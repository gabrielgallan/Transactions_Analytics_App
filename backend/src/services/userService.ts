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
    const user: User = database.select('users').where('id', uuid).data

    if (user) 
        return user
    else 
        throw new HttpError(404, 'Usuário não encontrado')
    
}

//Ajustar
async function deleteUserById(uuid: string) {
    try {
        const user = await selectUserById(uuid)
        const service = database.delete('users', user)

        if (database.select('users').where('id', uuid).data) {
            throw new HttpError(404, 'Erro ao deletar usuário')
        } else {
            return service
        }

    } catch (err: any) {
        throw err
    }
}

/*
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
    listUsers,
    selectUserById,
    deleteUserById
}