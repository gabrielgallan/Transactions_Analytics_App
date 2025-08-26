import { z } from "zod";

export function ZodErrorHandler(err: z.ZodError) {
    return err.errors.map(e => e.message)
}