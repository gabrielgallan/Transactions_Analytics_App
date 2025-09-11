import { RequestBodyUserData, User } from '../models/User.ts'
import { HttpError } from '../middlewares/ErrorHandlers.ts'
import { accountService } from './accountService.ts'
import { transactionServices } from './transactionsService.ts'
import { userRepository } from '../repositories/userRepository.ts'
import { UpdateUserData } from '../middlewares/RequestBody.ts'

async function createUser(userdata: RequestBodyUserData) {
  try {
    const user = User.create(userdata)
    const query = await userRepository.insert(user)

    return query
  } catch (err: any) {
    if (err instanceof HttpError) {
      throw err
    } else {
      throw new HttpError(500, `Erro ao criar usuário: ${err.message}`)
    }
  }
}

async function listUsers() {
  const rawUsers: User[] = await userRepository.selectAll()

  if (rawUsers)
    return rawUsers.map((user) => User.import(user).public_data())
  else
    throw new HttpError(500, 'Erro ao buscar usuários')
}

async function selectUserById(uuid: string) {
  const rawUser: User | null = await userRepository.findById(uuid)

  if (rawUser) return User.import(rawUser).public_data()
  else throw new HttpError(404, 'Usuário não encontrado')
}

async function deleteUserById(uuid: string) {
  const query = await userRepository.delete(uuid)

  if (query) 
    return `Usuário deletado: ${uuid}`
  else
    throw new HttpError(404, 'Usuário não encontrado')
}

async function updateUser(uuid: string, update: UpdateUserData) {
  const rawUser: User | null = await userRepository.findById(uuid)

  if (rawUser) {
    if (User.import(rawUser).compare_pass(update.auth) === 'success'){
      try {
        const updated = await userRepository.update(uuid, update.data)
        return updated

      } catch (err: any) {
        if (err instanceof HttpError) throw err
        else throw new HttpError(500, `Erro ao atualizar usuário: ${err.message}`)
      }
    } else {
      throw new HttpError(401, `Erro de autorização, senha inválida`)
    }
  } else {
    throw new HttpError(404, 'Usuário não encontrado')
  }
}

export const userService = {
  createUser,
  listUsers,
  selectUserById,
  deleteUserById,
  updateUser,
}
