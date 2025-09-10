import fastify, { FastifyInstance } from 'fastify'
import { accountController } from '../controllers/accountController.ts'

const app = fastify()

export async function accountRoutes(app: FastifyInstance) {
  app.get('/accounts', accountController.listAccounts)

  app.get('/accounts/:id', accountController.selectAccountById)

  app.post('/accounts/:id/transactions', accountController.createTransaction)

  app.get('/accounts/:id/transactions', accountController.listAccountTransactions)
}
