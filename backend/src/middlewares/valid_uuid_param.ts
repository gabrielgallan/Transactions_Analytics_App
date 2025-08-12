import { z } from "zod"

export function validUUIDParam(param: unknown) {
    const uuidSchema = z.object({
        id: z.string().uuid()
    })

    const uuid = uuidSchema.safeParse(param)

    if ( uuid.success ) 
        return uuid.data.id
    else 
        throw { code: 400, message: 'O parâmetro ID deve ser um UUID válido.' }
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