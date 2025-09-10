import { z } from 'zod'

export function ZodErrorHandler(err: z.ZodError) {
  return err.errors.map((e) => e.message)
}

export class HttpError extends Error {
  public code: number

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}
