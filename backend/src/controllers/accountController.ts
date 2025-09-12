import { FastifyRequest, FastifyReply } from 'fastify'
import { accountService } from '../services/accountService.ts'
import { uuid_schema } from '../middlewares/RequestParams.ts'
import { HttpError } from '../middlewares/ErrorHandlers.ts'
import { transactionServices } from '../services/transactionsService.ts'
import { TransactionSchema } from "../models/Transaction.ts"

async function listAccounts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const accounts = await accountService.listAccounts()
    reply.status(200).send({ status: 'success', accounts })
  } catch (err: any) {
    if (err instanceof HttpError) {
      reply.status(err.code).send({ status: 'failed', message: err.message })
    } else {
      reply.status(400).send({
        status: 'failed',
        message: 'Erro na requisição: ' + err.message,
      })
    }
  }
}

async function selectAccountById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const uuid = uuid_schema(request.params)
    const account = await accountService.selectAccountById(uuid)

    reply.status(200).send({ status: 'success', account })
  } catch (err: any) {
    if (err instanceof HttpError) {
      reply.status(err.code).send({ status: 'failed', message: err.message })
    } else {
      reply.status(500).send({ status: 'failed', message: err.message })
    }
  }
}

async function createTransaction(request: FastifyRequest, reply: FastifyReply) {
  try {
    const uuid = uuid_schema(request.params)
    const data = TransactionSchema.parse(request.body)
    const transaction = await transactionServices.createTransaction(uuid, data)

    reply.status(201).send({ status: 'success', transaction })
  } catch (err: any) {
    if (err instanceof HttpError) {
      reply.status(err.code).send({ status: 'failed', message: err.message })
    } else {
      reply.status(500).send({ status: 'failed', message: err.message })
    }
  }
}

async function listAccountTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const uuid = uuid_schema(request.params)
    const transactions = await transactionServices.listAccountTransactions(uuid)

    reply.status(200).send({ status: 'success', transactions })
  } catch (err: any) {
    if (err instanceof HttpError) {
      reply.status(err.code).send({ status: 'failed', message: err.message })
    } else {
      reply.status(500).send({ status: 'failed', message: err.message })
    }
  }
}

export const accountController = {
  listAccounts,
  selectAccountById,
  createTransaction,
  listAccountTransactions,
}
