import knex from 'knex'
import type { Knex } from 'knex'

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: './database/app.db'
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./database/migrations"
    }
}

const db = knex(config)

export default db