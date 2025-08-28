import { randomUUID } from 'crypto'
import { HttpError } from './HttpErrors.ts'
import * as bcrypt from 'bcryptjs'
import { z } from 'zod'

//Usado nos Sevices
export interface UserData {
        name: string
        age: number
        cpf: string
        email: string
        password: string
}

//Usado nos Controllers para validar dados da requisição
export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email('Email inválido'),
    age: z.number().min(18, 'O usuário deve ser maior de idade'),
    cpf: z.string().regex(/^\d{11}$/, "CPF inválido"),
    password: z.string().regex(/^\d{6}$/, "Senha deve conter exatamente 6 dígitos")
})

export class User {
    private id: string
    public name: string
    public age: number
    public cpf: string
    public email: string
    private password: string
    

    constructor( userdata: UserData ) {
        this.id = randomUUID()
        this.name = userdata.name
        this.age = userdata.age
        this.cpf = userdata.cpf
        this.email = userdata.email
        this.password = bcrypt.hashSync(userdata.password, 10)
    }

    //Getters
    get get_password(): string {
        return this.password
    }

    get get_id(): string {
        return this.id
    }

    //Setters

    
    //Methods
    validate_process(db: User[]): Status {
        return new ValidateUserService().process(this, db)
    }
}

enum Status {
    success = 'success',
    failed = 'failed'
}

class ValidateUserService {
    public status!: Status

    process(user: User, db: User[]): Status {
        if (db.find((u: User) => u.cpf === user.cpf)) {
            throw new HttpError(409, 'Este CPF já está cadastrado')
        }
        if (db.find((u: User) => u.email === user.email)) {
            throw new HttpError(409, 'Este email já está cadastrado')
        }

        return Status.success
    }
}

export interface UpdateData {
    type: 'email' | 'password',
    data: string
}

export const UpdateDataSchema = z.object({
    type: z.enum(["email", "password"]),
    data: z.string(),
})