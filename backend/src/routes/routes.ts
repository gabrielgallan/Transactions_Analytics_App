import { FastifyInstance } from 'fastify'
import { userRoutes } from '../routes/userRoutes.ts'
import { accountRoutes } from '../routes/accountRoutes.ts'

export async function registerRoutes(app: FastifyInstance) {
  app.register(userRoutes)
  app.register(accountRoutes)
}
