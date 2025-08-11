import { app } from './app.ts'

const port = 3006

app.listen({ 
    port: 3006,
    host: '0.0.0.0'
})
.then((address) => console.log(`Server is running on ${address}`))
.catch((err) => console.error(err))