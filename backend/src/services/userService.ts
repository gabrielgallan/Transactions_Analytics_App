import { UserData, User } from "../models/User.ts"
import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"

async function criarUsuario( userdata: UserData ) {
        const { name, age, cpf, email, password } = userdata.data
        
        const user = new User(name, age, cpf, email, password)
        const validation = user.validateInfos(database.select('users'))
        
        if (validation.status) {
            const user_account = new Account(user.getId, user.getName)
            database.insert('users', user)
            database.insert('accounts', user_account)

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

export const userService = {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPeloId,
    buscarContaDoUsuario
}