import { FastifyRequest, FastifyReply } from 'fastify'
import { accountService } from '../services/accountService'


const listarContas = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const accounts = await accountService.listarContas()
        reply.status(200).send({ status: true, data: accounts })
    } catch(err) {
        reply.status(400).send({ status: false, message: 'Erro na requisição' })
    }
}

export const accountController = {
    listarContas
}