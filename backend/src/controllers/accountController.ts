import { FastifyRequest, FastifyReply } from 'fastify'
import { accountService } from '../services/accountService.ts'
import { uuid_schema } from '../middlewares/request_handler.ts'
import { HttpError } from '../models/HttpErrors.ts'


async function listAccounts (request: FastifyRequest, reply: FastifyReply) {
    try {
        const accounts = await accountService.listAccounts()
        reply.status(200).send({ status: 'success', accounts })
    } catch(err: any) {
        if (err instanceof HttpError) {
            reply.status(err.code).send({ status: 'failed', message: err.message })
        } else {
           reply.status(400).send({ status: 'failed', message: 'Erro na requisição: ' + err.message }) 
        }
    }
}
/*
async function buscarContaPeloId(request: FastifyRequest, reply: FastifyReply) {
    try {
        const accountUUID = uuid_schema(request.params)
        const account = await accountService.buscarContaPeloId(accountUUID)
        reply.status(200).send({ status: true, data: { account } })

    } catch (err: any) {
        reply.status(err.code).send({ status: false, message: err.message })
    }
}
*/
export const accountController = {
    listAccounts
}