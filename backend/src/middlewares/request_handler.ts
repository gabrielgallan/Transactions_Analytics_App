import { z } from "zod"
import { HttpError } from "../models/HttpErrors.ts"

export function uuid_schema(param: unknown) {
    const uuidSchema = z.object({
        id: z.string().uuid()
    })

    const uuid = uuidSchema.safeParse(param)

    if ( uuid.success ) 
        return uuid.data.id
    else 
        throw new HttpError(400, 'O parâmetro ID deve ser um UUID válido.')
}

export function validDataToSet(req_body: unknown) {
    const bodySchema = z.object({
        type: z.string(),
        data: z.string()
    })

    const body = bodySchema.safeParse(req_body)

    if ( body.success ) 
        return body.data
    else
        throw { code: 400, message: 'O body da requisição está inválido' }
    
}