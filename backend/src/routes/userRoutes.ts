import fastify, { FastifyInstance } from "fastify"
import {userController} from '../controllers/userController'

const app = fastify()

export async function userRoutes(app:FastifyInstance) {
    app.post('/users', userController.criarUsuario)
}