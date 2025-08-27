import fastify, { FastifyInstance } from "fastify"
import { userController } from '../controllers/userController.ts'

const app = fastify()

export async function userRoutes(app:FastifyInstance) {
    app.post('/users', userController.createUser)

    app.get('/users', userController.listUsers)

    app.get('/users/:id', userController.selectUserById)

    app.delete('/users/:id', userController.deleteUserById)

    app.put('/users/:id', userController.updateUser)
}