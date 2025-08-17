import { z } from "zod"

export function TransactionBody(body: unknown) {
    const TransactionSchema = z.object({
        data: z.object({
            title: z.string(),
            category: z.string(),
            amount: z.number(),
            type: z.string()
        })
    })

    const req = TransactionSchema.safeParse(body)

    if ( req.success ) 
        return req.data.data
    else
        throw new Error('O body da requisição está inválido')
}