import { z } from 'zod'
import { HttpError } from './ErrorHandlers.ts'

export function uuid_schema(param: unknown) {
  const uuidSchema = z.object({
    id: z.string().uuid(),
  })

  const uuid = uuidSchema.safeParse(param)

  if (uuid.success) return uuid.data.id
  else throw new HttpError(400, 'O parâmetro ID deve ser um UUID válido.')
}
