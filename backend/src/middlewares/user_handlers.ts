import { HttpError } from "../models/HttpErrors.ts";
import { UpdateData, User } from "../models/User.ts";
import * as bcrypt from 'bcryptjs'


export async function UpdateUserHandler( update: UpdateData, uuid: string, db: User[] ) {
    db = db.filter((user) => user.get_id !== uuid)
    switch(update.type) {
        case 'email':
            if (db.find((u: User) => u.email === update.data)) {
                throw new HttpError(409, 'Este email já está cadastrado')
            }
            return { [update.type]: update.data }
            break
        case 'password':
            if (update.data.length !== 6) {
                throw new HttpError(404, 'Senha deve conter exatamente 6 dígitos')
            }
            return { [update.type]: bcrypt.hashSync(update.data, 10) }
            break
        default:
            throw new HttpError(404, 'Parâmetros da requisição incorretos')
    }
}