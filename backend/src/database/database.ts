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
        const data = this.database[table] ?? []
        return new Query(data)
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

    public async delete(table: string, id: string) {
        if (!this.database[table]) {
            throw new HttpError(404, 'Tabela não encontrada')
        }
    
        const index = this.database[table].findIndex((data: Record<string, any>) => data.id === id)
    
        if (index === -1) {
            throw new HttpError(404, 'Recurso não encontrado')
        }
    
        const [removed] = this.database[table].splice(index, 1)
    
        await this.persist()
        return removed
    }

    public async update(table: string, id: string, newData: Record<string, any>) {
        if (!this.database[table]) {
            throw new HttpError(404, 'Tabela não encontrada');
        }
    
        const index = this.database[table].findIndex((data: Record<string, any>) => data.id === id);
    
        if (index === -1) {
            throw new HttpError(404, 'Recurso não encontrado');
        }
    
        // Substitui o elemento pelo novo dado
        this.database[table][index] = newData
        
    
        await this.persist()
        return this.database[table][index]
    }
}


class Query {
    public data: any

    constructor(data: any) {
        this.data = data;
    }

    where(key: string, value: any){
        return new Query(
            this.data.filter((item: any) => item[key] === value)
        )
    }

    all() {
        return this.data;
    }

    first() {
        return this.data.length > 0 ? this.data[0] : null;
    }
}
