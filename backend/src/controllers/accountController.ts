import { FastifyRequest, FastifyReply } from 'fastify'
import { accountService } from '../services/accountService.ts'
import { validUUIDParam } from '../middlewares/valid_uuid_param.ts'


async function listarContas (request: FastifyRequest, reply: FastifyReply) {
    try {
        const accounts = await accountService.listarContas()
        reply.status(200).send({ status: true, data: accounts })
    } catch(err) {
        reply.status(400).send({ status: false, message: 'Erro na requisição' })
    }
}

async function buscarContaPeloId(request: FastifyRequest, reply: FastifyReply) {
    try {
        const accountUUID = validUUIDParam(request.params)
        const account = await accountService.buscarContaPeloId(accountUUID)
        reply.status(200).send({ status: true, data: { account } })

    } catch (err: any) {
        reply.status(err.code).send({ status: false, message: err.message })
    }
}

export const accountController = {
    listarContas,
    buscarContaPeloId
}