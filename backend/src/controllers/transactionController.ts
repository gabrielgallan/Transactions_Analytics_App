import { FastifyRequest, FastifyReply } from 'fastify'
import { uuid_schema } from '../middlewares/request_handler.ts'
import { transactionService } from '../services/transactionsService.ts'
import { TransactionBody } from '../middlewares/valid_transaction.ts'

async function criarTransacao (request: FastifyRequest, reply: FastifyReply) {
    try {
        const account_uuid = uuid_schema( request.params )
        const body = TransactionBody( request.body )
        const transaction = await transactionService.criarTransacao( account_uuid, body )

        reply.status(201).send({ status: true, data: transaction })
    } catch(err: any) {
        reply.status(400).send({ status: false, message: err.message })
    }
}

async function listarTransacoesDaConta (request: FastifyRequest, reply: FastifyReply) {
    try {
        const account_uuid = uuid_schema( request.params )
        const transactions = await transactionService.listarTransacoesDaConta( account_uuid )

        reply.status(200).send({ status: true, transactions })
    } catch(err: any) {
        reply.status(404).send({ status: false, message: err.message })
    }
}

export const transactionsController = {
    criarTransacao,
    listarTransacoesDaConta
}