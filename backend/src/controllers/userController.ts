import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '../services/userService.ts'
import { uuid_schema } from '../middlewares/RequestParams.ts'
import { ParseBodyUserData, ParseBodyToUpdateUser, UpdateUserData } from '../middlewares/RequestBody.ts'

async function createUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userdata = ParseBodyUserData(request.body)
    const user = await userService.createUser(userdata)

    reply.status(201).send({ status: 'success', user })
  } catch (err: any) {
    reply.status(err.code).send({ status: 'failed', message: err.message })
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
    const uuid: string = uuid_schema(request.params)
    const user = await userService.selectUserById(uuid)

    reply.status(200).send({ status: 'success', user })
  } catch (err: any) {
    reply.status(err.code).send({ status: 'failed', message: err.message })
  }
}

async function deleteUserById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const uuid: string = uuid_schema(request.params)
    const data = await userService.deleteUserById(uuid)

    reply.status(200).send({ status: 'success', data })
  } catch (err: any) {
    reply.status(err.code).send({ status: 'failed', message: err.message })
  }
}

async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const uuid: string = uuid_schema(request.params)
    const update: UpdateUserData = ParseBodyToUpdateUser(request.body)
    const updated = await userService.updateUser(uuid, update)

    reply.status(200).send({ status: 'success', user: updated })
  } catch (err: any) {
    reply.status(err.code).send({ status: 'failed', message: err.message })
  }
}

export const userController = {
  createUser,
  listUsers,
  selectUserById,
  deleteUserById,
  updateUser,
}
