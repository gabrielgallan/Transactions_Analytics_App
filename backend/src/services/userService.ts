import { User } from "../models/User"
import { UserData } from "../models/User"
import { Account } from "../models/Accounts"
import { accounts_db } from "./accountService"

export const fakeDB: User[] = []

const criarUsuario = async ( userdata: UserData ) => {
        const { name, age, cpf, email, password } = userdata.data
        
        const user = new User(name, age, cpf, email, password)
        const validation = user.validateInfos(fakeDB)
        
        if (validation.status) {
            const user_account = new Account(user.getId, user.getName)
            fakeDB.push(user)
            accounts_db.push(user_account)
        } else {
            throw { message: validation.messages, code: validation.code }
        }
}

const listarUsuarios = async () => {
    const usuarios: User[] = fakeDB

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