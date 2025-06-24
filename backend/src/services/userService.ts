import { User } from "../models/User"

export const fakeDB: User[] = []

const criarUsuario = async (name: string, email: string) => {
    const usuario = new User(name, email)

    fakeDB.push(usuario)

    return usuario
}

export const userService = {
    criarUsuario
}