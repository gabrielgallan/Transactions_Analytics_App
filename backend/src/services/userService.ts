import { UserData, User } from "../models/User.ts"
import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"
import { HttpError } from "../models/HttpErrors.ts"
import { PutUserHandler } from "../utils/User.ts"

async function criarUsuario( userdata: UserData ) {
        const { name, age, cpf, email, password } = userdata.data
        
        const user = new User(name, age, cpf, email, password)
        const validation = user.validateInfos(database.select('users'))
        
        if (validation.status) {
            const user_account = new Account(user)
            database.insert('users', user)
            database.insert('accounts', user_account)

            return user 
        } else {
            throw { message: validation.messages, code: validation.code }
        }
}

async function listarUsuarios() {
    const usuarios: User[] = database.select('users')

    if ( usuarios ) {
        return usuarios
    } else {
        throw ({ message: 'Não foi possível encontrar usuários' })
    }
}

async function buscarUsuarioPeloId( uuid: string ) {
    const user: User  = database.select_where('users', 'id', uuid)
    if ( user ) {
        return user
    } else {
        throw { code: 404, message: 'User not found' }
    }
}

async function buscarContaDoUsuario( uuid: string ) {
    const account: Account = database.select_where('accounts', 'user_id', uuid)
    if ( account ) {
        return account
    } else {
        throw { code: 404, message: 'Account not found' }
    }
}

async function deletarUsuarioPeloId( uuid: string ) {
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

async function atualizarUsuario( uuid: string, body: any ) {
    try {
        const user: User = await buscarUsuarioPeloId( uuid )
        const SetRequest = PutUserHandler( body.type, body.data, user )

        return await database.update('users', uuid, user)
    } catch (err: any) {
        throw { message: err.message, code: err.code || 500 }
    }
}

export const userService = {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPeloId,
    buscarContaDoUsuario,
    deletarUsuarioPeloId,
    atualizarUsuario
}