import { User } from "../models/User.ts"
import { database } from "../app.ts"

export function PutUserHandler( type: string, data: string, user: User ) {
    const db = database.select('users')

    switch( type ) {
        case 'email':
            return user.TrySetEmail(db, user, data)
            break
        case 'password':
            return user.TrySetPassword(user, data)
            break
    }
}