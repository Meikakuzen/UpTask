import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'

const app = express()

dotenv.config()
app.use(express.json())

conectarDB()

//ROUTING

app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes)





const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})