import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '../services/userService'
import { UserData } from '../models/User'
import { z } from 'zod'

const criarUsuario = async (request: FastifyRequest, reply: FastifyReply) => {
    const userdata = request.body as UserData

        try {
            const newUser = await userService.criarUsuario(userdata)
            reply.status(201).send({ status: true, message: `Usuário criado` })

        } catch (err: any) {
            reply.status(err.code).send({ status: false, message: err.message })
        }
}

const listarUsuarios = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const users = await userService.listarUsuarios()
            reply.status(200).send({ status: true, data: {users} })

        } catch (err: any) {
            reply.status(400).send({ status: false, message: err.message })
        }
}

export const userController = {
    criarUsuario,
    listarUsuarios
}