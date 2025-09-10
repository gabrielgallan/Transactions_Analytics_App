import { UserData, User, UserSchema, UpdateData } from "../models/User.ts"
import { Account } from "../models/Accounts.ts"
import { database } from "../app.ts"
import { HttpError } from "../models/HttpErrors.ts"
import { UpdateUserHandler } from "../middlewares/user_handlers.ts"
import { z } from "zod"
import { accountService } from "./accountService.ts"
import { transactionServices } from "./transactionsService.ts"

async function createUser(userdata: UserData) {
    try {
        const user = new User(userdata)
        const proccess = user.validate_process(database.select('users').data)
        await accountService.createAccount(user, userdata.password)
        
        database.insert('users', user)
        return proccess
    } catch (err) {
        throw err
    }
}

async function listUsers() {
    const rawUsers: User[] = database.select('users').data
    const users = rawUsers.map(user => {
        return User.import(user).public_data()
    })

    return users
}

async function selectUserById(uuid: string) {
    const rawUser: User = database.select('users').where('id', uuid).data[0]

    if (rawUser)
        return User.import(rawUser).public_data()
    else
        throw new HttpError(404, 'Usuário não encontrado')

}

async function deleteUserById(uuid: string) {
    try {
        const removed: User = await database.delete('users', uuid)

        const account_json: Account = database.select('accounts').where('user_id', uuid).data[0]
        const account_id: string = Account.import(account_json).public_data().id
        const removed_account : Account = await database.delete('accounts', account_id)

        await transactionServices.deleteAccountTransactions(account_id)

        return { user: User.import(removed).public_data(), account: Account.import(removed_account).public_data() }

        return { removed, account_id }
    } catch (err: any) {
        throw err
    }
}

async function updateUser(uuid: string, update: UpdateData) {
    try {
        const user: User = User.import(database.select('users').where('id', uuid).data[0])
        if (user.compare_pass(update.password) === 'success') {
            const data = await UpdateUserHandler(update, user, database.select('users').data)

            const updated = {
                ...user,
                ...data
            }

            const service = await database.update('users', uuid, updated)
            return User.import(service).public_data()
        } else {
            throw new HttpError(401, 'Não autorizado, senha incorreta')
        }
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            throw new HttpError(404, err.errors[0].message)
        }

        throw err
    }
}

export const userService = {
    createUser,
    listUsers,
    selectUserById,
    deleteUserById,
    updateUser
}