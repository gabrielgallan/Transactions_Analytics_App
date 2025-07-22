import { User } from "../models/User"
import { UserData } from "../models/User"

export const fakeDB: User[] = []

const criarUsuario = async ( userdata: UserData ) => {
        const { name, age, cpf, email, password } = userdata.data
        
        const usuario = new User(name, age, cpf, email, password)
        const validation = usuario.validateInfos(fakeDB)
        
        if (validation.status) {
            fakeDB.push(usuario)
        } else {
            throw new Error(`${validation.messages}`)
        }
}

const listarUsuarios = async () => {
        const usuarios: User[] = fakeDB
        return usuarios
}

export const userService = {
    criarUsuario,
    listarUsuarios
}