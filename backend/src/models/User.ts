const randomUUID = '01'

export class User {
    private id: string
    public name: string
    public age: number
    private cpf: number
    private email: string
    private password: string
    

    constructor(name, age, cpf, email, password) {
        this.id = randomUUID
        this.name = name
        this.age = age
        this.cpf = cpf
        this.email = email
        this.password = password
    }

    //Getters
    public get getId(): string {
        return this.id
    }

    public get getName(): string {
        return this.name
    }

    public get getEmail(): string {
        return this.email;
    }

    public get getPassword(): string {
        return this.password;
    }

    //Setters
    public set setName(newName: string) {
        this.name = newName
    }

    public set setEmail(newEmail: string) {
        this.email = newEmail
    }

    public set setPassword(newPass: string) {
        this.password = newPass
    }

    //Methods
    public openAccount(): void {
        
    }
}