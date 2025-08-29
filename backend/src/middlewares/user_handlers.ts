import { z } from "zod";
import { HttpError } from "../models/HttpErrors.ts";
import { UpdateData, User } from "../models/User.ts";
import * as bcrypt from 'bcryptjs'


export async function UpdateUserHandler( update: UpdateData, user: User, db: User[] ) {
    db = db.filter(u => u.email !== user.email)
    switch(update.type) {
        case 'email':
            (z.string().email('Email inválido')).parse(update.data)
            if (db.find((u: User) => u.email === update.data)) {
                throw new HttpError(409, 'Este email já está cadastrado')
            }
            return { [update.type]: update.data }
            break
        case 'password':
            if ( user.compare_pass( update.data ) )
                throw new HttpError(409, 'A senha não deve ser a mesma')
            if ( update.data.length !== 6 ) {
                throw new HttpError(404, 'Senha deve conter exatamente 6 dígitos')
            }
            return { [update.type]: bcrypt.hashSync(update.data, 10) }
            break
        default:
            throw new HttpError(404, 'Parâmetros da requisição incorretos')
    }
}