import fastify, { FastifyInstance } from "fastify"
import { accountController } from '../controllers/accountController.ts'
import { transactionsController } from '../controllers/transactionController.ts'

const app = fastify()

export async function accountRoutes(app:FastifyInstance) {
    app.get('/accounts', accountController.listAccounts)

    /*app.get('/accounts/:id', accountController.buscarContaPeloId)

    app.post('/accounts/:id/transactions', transactionsController.criarTransacao)

    app.get('/accounts/:id/transactions', transactionsController.listarTransacoesDaConta)*/
}