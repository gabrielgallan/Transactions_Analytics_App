import fastify from "fastify"
import { userRoutes } from "./routes/userRoutes"
import { accountRoutes } from "./routes/accountRoutes"

export const app = fastify()

//Registrando as rotas da aplicação
app.register(userRoutes)
app.register(accountRoutes)