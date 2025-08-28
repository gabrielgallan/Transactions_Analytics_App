import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '../services/userService.ts'
import { UserSchema, UpdateData, UpdateDataSchema } from '../models/User.ts'
import { uuid_schema } from '../middlewares/request_handler.ts'
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
            reply.status(404).send({ status: 'failed', message })
        } else if (err instanceof HttpError){
            reply.status(err.code).send({ status: 'failed', message: err.message })
        } else {
            reply.status(500).send({ status: 'failed', message: err.message })
        }
    }
}

async function listUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
        const users = await userService.listUsers()
        reply.status(200).send({ status: 'success', users })
    } catch (err: any) {
        reply.status(500).send({ status: 'failed', message: err.message })
    }
}

async function selectUserById(request: FastifyRequest, reply: FastifyReply) {
    try {
        const uuid: string = uuid_schema( request.params )
        const user = await userService.selectUserById( uuid )
        reply.status(200).send({ status: 'success', user })
    } catch (err: any) {
        reply.status(err.code).send({ status: 'failed', message: err.message })
    }
}

async function deleteUserById(request: FastifyRequest, reply: FastifyReply) {
    try {
        const uuid: string = uuid_schema( request.params )
        const response = await userService.deleteUserById( uuid )
        reply.status(200).send(response)

    } catch (err: any) {
        reply.status(err.code).send({ status: 'failed', message: err.message})
    }
}


async function updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const uuid: string = uuid_schema(request.params)
        const update = UpdateDataSchema.parse(request.body)
        const service = await userService.updateUser(uuid, update)

        reply.status(200).send({ status: 'success', user: service })
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const message = ZodErrorHandler(err)
            reply.status(404).send({ status: 'failed', message })
        } else if (err instanceof HttpError){
            reply.status(err.code).send({ status: 'failed', message: err.message }) 
        } else {
            reply.status(500).send({ status: 'failed', message: err.message })
        }
        
    }
}

export const userController = {
    createUser,
    listUsers,
    selectUserById,
    deleteUserById,
    updateUser
}