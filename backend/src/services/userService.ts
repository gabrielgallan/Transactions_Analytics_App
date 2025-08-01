import { UserData, User } from "../models/User.ts"
import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"

const criarUsuario = async ( userdata: UserData ) => {
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

const listarUsuarios = async () => {
    const usuarios: User[] = database.select('users')

    if ( usuarios ) {
        return usuarios
    } else {
        throw ({ message: 'Não foi possível encontrar usuários' })
    }
}

export const userService = {
    criarUsuario,
    listarUsuarios
}