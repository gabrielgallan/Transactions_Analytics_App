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

//Classe Users
export class User {
    private id: string
    private name: string
    private age: number
    private cpf: string
    private email: string
    private password: string
    private roles: UserRoles


    constructor(userdata: UserData) {
        this.id = randomUUID()
        this.name = userdata.name
        this.age = userdata.age
        this.cpf = userdata.cpf
        this.email = userdata.email
        this.password = bcrypt.hashSync(userdata.password, 10)
        this.roles = UserRoles.operator
    }

    //Getters
    get password_hash(): string {
        if (this.roles === UserRoles.admin) {
            this.roles = UserRoles.none
            return this.password
        } else {
            return Status.failed
        }
    }

    //Setters

    //Methods
    validate_process(db: User[]): Status {
        const result = new ValidateUserService().process(this, db)
        this.roles = UserRoles.admin
        return result
    }

    public_data(): Omit<UserData, "password"> & { id: string } {
        if (this.roles === UserRoles.operator || this.roles === UserRoles.admin) {
            this.roles = UserRoles.none
            return {
                id: this.id,
                name: this.name,
                age: this.age,
                cpf: this.cpf,
                email: this.email
            }
        }
        return {
            id: '',
            name: '',
            age: 0,
            cpf: '',
            email: ''
        }
    }

    authenticate(password: string): Status {
        if (bcrypt.compareSync(password, this.password)) {
            this.roles = UserRoles.admin
            return Status.success
        }
        return Status.failed
    }

    compare_pass(password: string): Status | null {
        if (this.roles === UserRoles.operator || this.roles === UserRoles.admin) {
            //this.roles = UserRoles.none
            if (bcrypt.compareSync(password, this.password))
                return Status.success
            else
                return Status.failed
        }

        return null
    }

    static import(json: any): User {
        const instance = Object.create(User.prototype)
        const user: User = Object.assign(instance, json)
        user.roles = UserRoles.operator

        return user
    }
}

enum UserRoles {
    creator = 'instance the user',
    admin = 'edit_data',
    operator = 'see_public_data',
    none = 'none'
}

enum Status {
    success = 'success',
    failed = 'failed'
}

class ValidateUserService {
    public status!: Status

    process(newuser: User, db: any): any {
        const user = newuser.public_data()

        if (db.find((u: any) => {
            return u.cpf === user?.cpf
        })) {
            throw new HttpError(409, 'Este CPF já está cadastrado')
        }
        if (db.find((u: any) => {
            return u.email === user?.email
        })) {
            throw new HttpError(409, 'Este email já está cadastrado')
        }

        return { status: Status.success, user }
    }
}

export interface UpdateData {
    type: 'email' | 'password',
    data: string,
    password: string
}

export const UpdateDataSchema = z.object({
    type: z.enum(["email", "password"]),
    data: z.string(),
    password: z.string()
})