import fs from 'fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
    private database: Record<string, any> = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.database = JSON.parse(data)
            })
            .catch(() => {
                this.persist()
            })
    }

    private persist() {
        fs.writeFile(databasePath, JSON.stringify(this.database))
    }

    public select(table: string) {
        return this.database[table] ?? []
    }

    public insert(table: string, data: object) {
        if ( this.database[table] ) {
            this.database[table].push(data)
        } else {
            this.database[table] = [data]
        }

        this.persist()
        return data
    }
}