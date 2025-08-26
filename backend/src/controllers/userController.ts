import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '../services/userService.ts'
import { UserSchema } from '../models/User.ts'
import { validDataToSet, uuid_schema } from '../middlewares/request_handler.ts'
import { z } from 'zod'
import { ZodErrorHandler } from '../middlewares/zod_error_handler.ts'
import { HttpError } from '../models/HttpErrors.ts'

async function createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userdata = UserSchema.parse(request.body)
        const response = await userService.createUser(userdata)
        reply.status(201).send(response)

    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const message = ZodErrorHandler(err)
            reply.status(500).send({ status: 'failed', message })
        } else {
            reply.status(err.code).send({ status: 'failed', message: err.message })
        }
    }
}

async function listUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
        const users = await userService.listUsers()
        reply.status(200).send({ status: 'success', users })
    } catch (err: any) {
        reply.status(400).send({ status: 'failed', message: err.message || 'Erro inesperado' })
    }
}

async function selectUserById(request: FastifyRequest, reply: FastifyReply) {
    try {
        const uuid: string = uuid_schema( request.params )
        const user = await userService.selectUserById( uuid )
        reply.status(200).send({ status: 'success', user })
    } catch (err: any) {
        reply.status(err.code).send({ status: 'failed', message: err.message || 'Erro desconhecido' })
    }
}

async function deleteUserById(request: FastifyRequest, reply: FastifyReply) {
    try {
        const uuid: string = uuid_schema( request.params )
        const delete_service = await userService.deleteUserById( uuid )
        reply.status(200).send({ status: 'success', user: delete_service })

    } catch (err: any) {
        if (err instanceof HttpError) {
            reply.status(err.code)
                 .send({ status: 'failed', message: err.message})
        } else {
            reply.status(404)
                 .send({ status: 'failed', message: 'Erro inesperado ao deletar usuário'})
        }
    }
}

/*
async function atualizarUsuario(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user_uuid: string = validUUIDParam(request.params)
        const body = validDataToSet(request.body)
        const put_service = await userService.atualizarUsuario(user_uuid, body)

        reply.status(200).send({ status: true, message: 'Usuário atualizado', data: put_service })
    } catch (err: any) {
        reply.status(err.code).send({ status: false, message: 'Erro ao atualizar usuário: ' + err.message })
    }
}*/

export const userController = {
    createUser,
    listUsers,
    selectUserById,
    deleteUserById
}