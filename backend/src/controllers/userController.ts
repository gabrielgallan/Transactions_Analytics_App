import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '../services/userService'
import { z } from 'zod'

const criarUsuario = async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
            name: z.string(),
            age: z.number(),
            cpf: z.number(),
            email: z.string(),
            password: z.string()
        })

    const { name, age, cpf, email, password } = bodySchema.parse(request.body)

        try {
            const newUser = await userService.criarUsuario(name, age, cpf, email, password)
            reply.status(201).send('Usuário criado')
        } catch (err: any) {
            reply.status(400).send({ erro: err.message })
        }
}

const listarUsuarios = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const users = await userService.listarUsuarios()
            reply.status(200).send(users)
        } catch (err) {
            reply.status(400).send({ erro: err })
        }
}

export const userController = {
    criarUsuario,
    listarUsuarios
}