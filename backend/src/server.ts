import { app } from './app.ts'

const port = 3006

app.listen({
    port,
    host:'0.0.0.0',
}, () => console.log(`Server running on port ${port}`))