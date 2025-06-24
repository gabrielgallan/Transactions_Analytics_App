import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '../services/userService'
import {z} from 'zod'

const criarUsuario = async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
            name: z.string(),
            email: z.string()
        })

    const { name, email } = bodySchema.parse(request.body)
    try {
        const newUser = userService.criarUsuario(name, email)
        reply.status(201).send('Usuário criado')
    } catch (err) {
        reply.status(400).send({err: err.message})
    }
}

export const userController = {
    criarUsuario
}