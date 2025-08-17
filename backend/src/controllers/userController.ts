import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '../services/userService.ts'
import { UserData } from '../models/User.ts'
import { validDataToSet, validUUIDParam } from '../middlewares/valid_uuid_param.ts'

async function criarUsuario (request: FastifyRequest, reply: FastifyReply) {
    const userdata = request.body as UserData

        try {
            const newUser = await userService.criarUsuario(userdata)
            reply.status(201).send({ status: true, message: `Usuário criado`, data: newUser })

        } catch (err: any) {
            reply.status(err.code || 500).send({ status: false, message: err.message || 'Erro desconhecido' })
        }
}

async function listarUsuarios(request: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await userService.listarUsuarios()
            reply.status(200).send({ status: true, data: {users} })

        } catch (err: any) {
            reply.status(400).send({ status: false, message: err.message || 'Erro desconhecido' })
        }
}

async function buscarUsuarioPeloId(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userUUID: string = validUUIDParam( request.params )
        const user = await userService.buscarUsuarioPeloId( userUUID )
        reply.status(200).send({ status: true, data: { user } })

    } catch (err: any) {
        reply.status(err.code || 500).send({ status: false, message: err.message || 'Erro desconhecido' })
    }
}

async function buscarContaDoUsuario(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userUUID: string = validUUIDParam( request.params )
        const account = await userService.buscarContaDoUsuario( userUUID )
        reply.status(200).send({ status: true, data: { account } })

    } catch (err: any) {
        reply.status(err.code || 500).send({ status: false, message: err.message || 'Erro desconhecido' })
    }
}

async function deletarUsuarioPeloId(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userUUID: string = validUUIDParam( request.params )
        const delete_service = await userService.deletarUsuarioPeloId( userUUID )
        reply.status(200).send({ status: true, message: 'Usuário deletado', data: delete_service })

    } catch (err: any) {
        reply.status(err.code || 500).send({ status: false, message: 'Erro ao deletar usuário: ' + err.message })
    }
}

async function atualizarUsuario(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user_uuid: string = validUUIDParam( request.params )
        const body = validDataToSet( request.body )
        const put_service = await userService.atualizarUsuario(user_uuid, body)

        reply.status(200).send({ status: true, message: 'Usuário atualizado', data: put_service })
    } catch (err: any) {
        reply.status(err.code).send({ status: false, message: 'Erro ao atualizar usuário: ' + err.message })
    }
}

export const userController = {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPeloId,
    buscarContaDoUsuario,
    deletarUsuarioPeloId,
    atualizarUsuario
}