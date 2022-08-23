# UpTASK
## Primeros pasos
- Creo el servidor.
- Para ello creo una carpeta Backend y en el directorio escribo en la terminal npm init
- Instalo express (ya tengo instalado nodemon)
- El código del servidor inicialmente luce así:

~~~js
import express from 'express'

const app = express()


app.listen(4000, ()=>{
    console.log("Servidor corriendo en el puerto 4000")
})
~~~
## Creando base de datos
- Crear el cluster en mongoDB
- Copiar el enlace de conexión con MongoCompass
- Añadirlo a la conexión de Compass con el username y el password
## Conectar la base de datos
- Ahora copio el string de conexión de la web para conectar con la aplicación
- Creo la carpeta en backend de config con el archivo db.js
- Instalo mongoose
- En db.js importo mongoose y creo una función async llamada conectarDB con mongoose.connect
    - Le incorporo un try y un catch
    - En el catch, añado un console.log y dentro de un template string imprimo el error.message
    - Termino el proceso con process.exit(1)
    - en el try añado el string de conexión con el name y el password correspondientes
    - Le añado los parametros dentro de un objeto (junto al string de conexión)
    - useNewUrlParser y useUnifiedTopology, ambos en true
    - Creo una constante fuera del try llamada url con untemplate string para imprimir la conexión
    - La pongo dentro e un console.log
    - Para verlo en consola hay que integrar este archivo (db.js) en el index, para ello exporto por default conectarDB
- Importo conectarDB en el index, con el sufijo .js ya que es un archivo local que yo creé
- LLamo a la función dentro del archivo index.js

- index.js
~~~js
import express from 'express'
import conectarDB from './config/db.js'

const app = express()

conectarDB()

app.listen(4000, ()=>{
    console.log("Servidor corriendo en el puerto 4000")
})
~~~
------
- db.js
~~~js
import mongoose from "mongoose"

const conectarDB= async()=>{
    try {

        const connection= await mongoose.connect("mongodb+srv://isma:isma@cluster0.82so450.mongodb.net/?retryWrites=true&w=majority",{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const url=`${connection.connection.host}: ${connection.connection.port}`
        console.log(`MongoDB conectado en: ${url}`)
        
    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit(1)
    }
}


export default conectarDB
~~~
----

## Ocultar string de conexión
- Instalo en backend dotenv para configurar las variables de entorno
> npm i dotenv 
- Lo importo en index.js y escribo dotenv.config()
- Esto va a buscar el archivo .env. Lo creo
- Escribo la variable MONGO_URI con el string de conexión sin comillas
- Sustituyo el string de conexión en db.js por process.env.MONGO_URI
- Creo otra variable de entorno para el puerto

- index.js
~~~js
import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

conectarDB()

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
~~~
-----
- db.js

~~~js
import mongoose from "mongoose"

const conectarDB= async()=>{
    try {

        const connection= await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const url=`${connection.connection.host}: ${connection.connection.port}`
        console.log(`MongoDB conectado en: ${url}`)
        
    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit(1)
    }
}


export default conectarDB
~~~
-----
En el archivo .env en la raíz
~~~
MONGO_URI=mongodb+srv://isma:isma@cluster0.82so450.mongodb.net/?retryWrites=true&w=majority
~~~
-------
