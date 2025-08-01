import fastify from "fastify"
import { Database } from "./database/database.ts"
import { registerRoutes } from "./routes/routes.ts"

export const database = new Database

export const app = fastify()

//Registrando as rotas da aplicação
registerRoutes(app)