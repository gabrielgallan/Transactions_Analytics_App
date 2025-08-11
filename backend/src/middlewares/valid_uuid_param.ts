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