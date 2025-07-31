import { randomUUID } from 'crypto';

export class Account {
    private id: string
    private user_id: string
    private holder: string
    private balance: number
    private type: string

    constructor(user_id: string, holder: string) {
        this.id = randomUUID()
        this.user_id = user_id
        this.holder = holder
        this.balance = 0
        this.type = 'Corrente'
    }

    //Getters

    //Setters

    //Methods
    
}