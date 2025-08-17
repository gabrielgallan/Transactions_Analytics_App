import { FastifyRequest, FastifyReply } from 'fastify'
import { validUUIDParam } from '../middlewares/valid_uuid_param.ts'
import { transactionService } from '../services/transactionsService.ts'
import { TransactionBody } from '../middlewares/valid_transaction.ts'

async function criarTransacao (request: FastifyRequest, reply: FastifyReply) {
    try {
        const account_uuid = validUUIDParam( request.params )
        const body = TransactionBody( request.body )
        const transaction = await transactionService.criarTransacao( account_uuid, body )

        reply.status(201).send({ status: true, data: transaction })
    } catch(err: any) {
        reply.status(400).send({ status: false, message: err.message })
    }
}

async function listarTransacoes (request: FastifyRequest, reply: FastifyReply) {
    try {
        
    } catch(err) {
        
    }
}

export const transactionsController = {
    criarTransacao,
    listarTransacoes
}