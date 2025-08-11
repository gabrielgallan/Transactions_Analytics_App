import fastify, { FastifyInstance } from "fastify"
import { accountController } from '../controllers/accountController.ts'

const app = fastify()

export async function accountRoutes(app:FastifyInstance) {
    app.get('/accounts', accountController.listarContas)

    app.get('/accounts/:id', accountController.buscarContaPeloId)
}