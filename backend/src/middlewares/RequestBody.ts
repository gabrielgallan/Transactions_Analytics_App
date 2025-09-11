import { z } from 'zod'
import { UserData } from '../models/User.ts'
import { HttpError, ZodErrorHandler } from './ErrorHandlers.ts'
import { RequestBodyDefault } from 'fastify'

export function ParseBodyUserData(reqbody: RequestBodyDefault): UserData {
    const UserReqBodySchema = z.object({
        name: z.string(),
        email: z.string().email('Email inválido'),
        age: z.number().min(18, 'O usuário deve ser maior de idade'),
        cpf: z.string().regex(/^\d{11}$/, 'CPF inválido'),
        password: z
            .string()
            .regex(/^\d{6}$/, 'Senha deve conter exatamente 6 dígitos'),
    })

    const parse = UserReqBodySchema.safeParse(reqbody)

    if (parse.success) {
        return parse.data
    } else {
        throw new HttpError(404, ZodErrorHandler(parse.error))
    }
}

export function ParseBodyToUpdateUser(reqbody: RequestBodyDefault): UpdateUserData {
    const BodySchema = z.union([
        z.object({ email: z.string().email('Email inválido'), auth: z.string() }).strict(),
        z.object({ password: z.string().regex(/^\d{6}$/, 'Senha deve conter exatamente 6 dígitos'), auth: z.string() }).strict()
    ])

    const parse = BodySchema.safeParse(reqbody)

    if (parse.success) {
        const [key, value] = Object.entries(parse.data).find(([k]) => k !== "auth")!
        return {
            data: { [key]: value },
            auth: parse.data.auth
        }
    } else {
        throw new HttpError(400, ZodErrorHandler(parse.error))
    }
}

export type UpdateUserData = {
    data: object,
    auth: string
}

