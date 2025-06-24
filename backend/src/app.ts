import fastify from "fastify"
import { userRoutes } from "./routes/userRoutes"

export const app = fastify()

//Registrando as rotas da aplicação
app.register(userRoutes)