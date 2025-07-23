import { randomUUID } from 'crypto'

export interface UserData {
    data: {
      name: string
        age: number
        cpf: number
        email: string
        password: string  
    }
}

export class User {
    private id: string
    private name: string
    private age: number
    private cpf: number
    private email: string
    private password: string
    

    constructor(name: string, age: number, cpf: number, email: string, password: string) {
        this.id = randomUUID()
        this.name = name
        this.age = age
        this.cpf = cpf
        this.email = email
        this.password = password
    }

    //Getters
    get getId(): string {
        return this.id
    }

    get getName(): string {
        return this.name
    }

    //Setters
    set setEmail(newEmail: string) {
        this.email = newEmail
    }

    set setPassword(newPass: string) {
        this.password = newPass
    }

    //Methods
    validateInfos(db: any): any {
        const errors: string[] = []
        let code = null

        if (this.age < 18) {
            errors.push('O usuário deve ser maior de idade')
            code = 400
        }
        if (String(this.cpf).length !== 11) {
            errors.push('CPF deve ter 11 dígitos')
            code = 400
        }
        if (this.password.length !== 6) {
            errors.push('A senha deve conter 6 dígitos')
            code = 400
        }
        if (db.find((user: any) => user.email === this.email)) {
            errors.push('Este email já está cadastrado')
            code = 409
        }
        if (db.find((user: any) => user.cpf === this.cpf)) {
            errors.push('Este CPF já está cadastrado')
            code = 409
        }

        if (errors.length > 0) {
            return { status: false, messages: errors, code }
        }
        return { status: true }
    }
}