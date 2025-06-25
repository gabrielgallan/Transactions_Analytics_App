import { User } from "../models/User"

export const fakeDB: User[] = []

const criarUsuario = async (
    name: string,
    age: number,
    cpf:number, 
    email: string,
    password: string ) => {
        
        const usuario = new User(name, age, cpf, email, password)

        fakeDB.push(usuario)

        return usuario
}

const listarUsuarios = async () => {
    const usuarios: User[] = fakeDB

    return usuarios
}

export const userService = {
    criarUsuario,
    listarUsuarios
}