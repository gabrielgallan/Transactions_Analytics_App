import fs from 'fs/promises'
import { HttpError } from '../models/HttpErrors.ts'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
    private database: Record<string, any> = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.database = JSON.parse(data)
            })
            .catch(async () => {
                await this.persist()
            })
    }

    private async persist() {
        await fs.writeFile(databasePath, JSON.stringify(this.database))
    }

    public select(table: string) {
        return this.database[table] ?? []
    }

    public async insert(table: string, data: object) {
        if ( this.database[table] ) {
            this.database[table].push(data)
        } else {
            this.database[table] = [data]
        }

        await this.persist()
        return data
    }

    public select_where(table: string, paramType: string, paramData: any) {
        return this.select(table)
                   .find((data: Record<string, any>) => data[paramType] === paramData)
    }

    public async delete(table: string, paramType: string, paramData: any) {
        if (!this.database[table]) {
            throw new HttpError(404, 'Banco de dados não encontrado')
        } 
        
        const dataToDelete = this.select_where(table, paramType, paramData)
        
        if (!dataToDelete) {
            throw new HttpError(404, 'Usuário não encontrado')
        }

        this.database[table] = this.database[table].filter(
            (data: Record<string, any>) => data[paramType] !== paramData)

        if ( this.select_where(table, paramType, paramData) ) {
            throw new HttpError(500, 'Erro ao deletar recurso')
        }

        await this.persist()
        return dataToDelete
    }
}