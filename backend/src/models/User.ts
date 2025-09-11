import { randomUUID } from 'crypto'
import { HttpError } from '../middlewares/ErrorHandlers.ts'
import * as bcrypt from 'bcryptjs'
import { z } from 'zod'

// Usado nos Sevices
export interface RequestBodyUserData {
  name: string
  age: number
  cpf: string
  email: string
  password: string
}

export interface UserModel {
  id: string
  name: string
  age: number
  cpf: string
  email: string
  password: string
  created_at: string
}

// Classe Users
export class User {
  private id: string
  private name: string
  private age: number
  private cpf: string
  private email: string
  private password: string
  private created_at: string

  private constructor(userdata: RequestBodyUserData) {
    this.id = randomUUID()
    this.name = userdata.name
    this.age = userdata.age
    this.cpf = userdata.cpf
    this.email = userdata.email
    this.password = bcrypt.hashSync(userdata.password, 10)
    this.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19)
  }

  static create(userdata: RequestBodyUserData) {
    return new User(userdata)
  }

  static import(json: any): User {
    const instance = Object.create(User.prototype)
    const user: User = Object.assign(instance, json)

    return user
  }

  // Methods
  public_data(): Omit<UserModel, 'password' | 'created_at'> {
      return {
        id: this.id,
        name: this.name,
        age: this.age,
        cpf: this.cpf,
        email: this.email,
      }
  }

  /*authenticate(password: string): Status {
    if (bcrypt.compareSync(password, this.password)) {
      this.roles = UserRoles.admin
      return Status.success
    }
    return Status.failed
  }*/

  compare_pass(password: string): Status | null {
      if (bcrypt.compareSync(password, this.password)) return Status.success
      else return Status.failed
  }
}

export class ReturnUserDataToOpenAccount {
  static authenticate(rawuser: UserModel, userpass: string): Pick<UserModel, 'name' | 'id' | 'password'> | Status.unauthorized {
    const user: User = User.import(rawuser)
    if (user.compare_pass(userpass) === 'success') {
      return {
        name: rawuser.name,
        id: rawuser.id,
        password: rawuser.password
      }
    } else {
      return Status.unauthorized
    }
  }
}

enum Status {
  success = 'success',
  failed = 'failed',
  unauthorized = 'unauthorized'
}
