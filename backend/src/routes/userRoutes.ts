import fastify, { FastifyInstance } from "fastify"
import { userController } from '../controllers/userController.ts'

const app = fastify()

export async function userRoutes(app:FastifyInstance) {
    app.post('/users', userController.criarUsuario)

    app.get('/users', userController.listarUsuarios)

    app.get('/users/:id', userController.buscarUsuarioPeloId)

    app.get('/users/:id/account', userController.buscarContaDoUsuario)
}