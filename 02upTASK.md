# Model View Controller

- Creo una nueva carpeta llamada models
- Dentro un archivo llamado Usuario.js
    - Importo mongoose
    - Procedo a estructurar el Schema con mongoose.Schema
    - Nombre de tipo String, obligatorio y le quito los espacios con trim
    - Lo mismo con el password, y el mail
    - unique para que el mail sea único
    - Confirmado esta false por defecto porque recibirán un mail de confirmación para confirmar la cuenta
    - el timestamps para crear dos columnas más , una de creado y otra de actualizado
    - Creo el modelo con mongoose.model con el nombre del modelo y el Schema y lo hago disponible con el export default
~~~js
import mongoose from 'mongoose'

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token:{
        type: String
    },
    confirmado:{
        type: Boolean,
        default: false
    }

},{
    timestamps: true
})

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario
~~~
-----

## Routing y controladores
- El siguiente paso es crear el routing y los controladores para los diferentes endpoints para los verbos HTTP
- Se hará usando el app ( de const app = express()), pues concentra toda la funcionalidad de express
~~~js
app.get('/', (req,res)=>{
    res.send("Hola mundo!")
})
~~~
- Si coloco app.use , use responde a todos los verbos http
- Puedo enviar la respuesta tipo json
~~~js

app.get('/', (req,res)=>{
    res.json({msg: "OK"})
})
~~~

- Para no ensuciar el index con tanto código se recomienda ir agrupándolo en rutas y controladores
- Creo la carpeta routes en backend con el archivo usuarioRoutes
- Todo lo relacionado con usuarios se irá agrupando en este endpoint
    - Importo express para usar el Router
- En usuarioRoutes:
~~~js
import express from 'express'

const router = express.Router()

router.get('/', (req,res)=>{
    res.send("Desde API/USUARIOS")
})
router.post('/', (req,res)=>{
    res.send("Desde -POST API/USUARIOS")
})

export default router
~~~

- Ahora debo importarlo en el index.js
- Gracias al .use va a soportar en este endpoint todos los verbos http
~~~js
import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express()

dotenv.config()

conectarDB()

//ROUTING

app.use("/api/usuarios", usuarioRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

~~~
- Al hacerlo de esta forma, todos los request a este endpoint van a estar enun archivo aparte( usuarioRoutes.js )
- Para probar los endpoints se usará Postman
- Puedo simular los endpoints y los tipos de verbos con Postman
- Si lo que quiero es enrutar, puedo usar el primer parametro del router para hacerlo, por ejemplo a confirmar
~~~js
router.get('/confirmar', (req,res)=>{
    res.json({msg: "Okey, ahi lo tienes"})
})
~~~
- Esto sería igual a /api/usuarios/confirmar
## Introduciendo controladores

- Creo la carpeta controllers en Backend/ con el archivo usuarioController.js
- Va a comunicar el routing con los modelos
~~~js
const usuarios = (req,res) =>{
    res.json("Desde API/USUARIOS")
}

export {
    usuarios
}
~~~
- Ahora en usuarioRoutes importo usuarios y lo añado al endpoint
~~~js
import express from 'express'
import {usuarios} from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/', usuarios)




export default router
~~~

- Creo un crearUsuario, de tipo POST. Lo exporto 
- Lo importo en usuarioRoutes y lo añado
- usuarioController:
~~~js
const usuarios = (req,res) =>{
    res.json({msg: "desde Api Usuarios"})
}

const crearUsuario = (req,res) =>{
    res.json({msg: "creando usuario"})
}



export {
    usuarios,
    crearUsuario
}
~~~
-----
- usuarioRoutes:
~~~js
import express from 'express'
import {usuarios,crearUsuario} from '../controllers/usuarioController.js'

const router = express.Router()

router.get("/", usuarios)
router.post("/", crearUsuario)




export default router
~~~
----
- Uso Postman para controlar que los endpoints devuelven lo que hay en el res.json
-----
# AHORA BORRAMOS TODO LO PERTENECIENTE A LAS RUTAS Y VERBOS PARA EMPEZAR CON ALGO REALISTA



## Autenticación, registro y confirmación de usuarios

- Sigo el procedimiento anterior para crear registrar
~~~js
const registrar = (req,res)=>{

}

export {
    registrar
}
~~~
----
- Lo exporto de usuarioController y lo importo en usuarioRoutes
~~~js
import express from 'express'
import {registrar} from '../controllers/usuarioController.js'


const router = express.Router()


router.post("/", registrar) //crea un nuevo usuario




export default router
~~~
-----
- Ahora toca trabajar el cuerpo de la función registrar
- Usaré los valores del Schema, nombre, email y password
----
- Para enviar datos desde POSTMAN simulando que vienen de un formulario pulsa body y en raw cambiar a json (donde pone text)
- Si en el cuerpo de la función registrar pongo un console.log de req.body NO FUNCIONA, no recibe los datos que estoy enviando en formato json desde POSTMAN
- usuarioController.js:
~~~js
const registrar = (req,res)=>{
    console.log(req.body)
    res.json({msg:"OK!"})
}
~~~
- En el index.js hay que habilitar que pueda procesar info en formato json
~~~js
app.use(express.json())
~~~
- Ahora si aparece en consola el json que envié desde POSTMAN
- Entonces, ya puedo insertarlo en la base de datos
- Para insertarlo hay que importar el modelo en el controlador
    - Uso el try catch para insertar los datos en la DB dentro de la función registrar
    - Creo una nueva instancia de Usuario y le paso el req.body
    - Puedo colocarle el usuario en un console.log para ver si todo marcha bien
~~~js

const registrar = (req,res)=>{
    
    try {
        const usuario = new Usuario(req.body)
        
        console.log(usuario)
    
    } catch (error) {
        console.log(error)
    }


    res.json({msg:"OK!"})
}

~~~
- Para almacenarlo (aún no se ha almacenado) usaré async await y usuario.save()
~~~js

const registrar = async (req,res)=>{
    
    try {
        const usuario = new Usuario(req.body)
        
        const usuarioAlmacenado= await usuario.save()
        res.json({msg:"OK!"})

    } catch (error) {
        console.log(error)
    }


}
~~~
- Ahora , si voy a POSTMAN y envío el json con el nuevo usuario puedo mirar en MongoCompass como se ha almacenado.

- Pero hay cosas que faltan:
    - El password no esta hasheado
    - No generó el token
    - Si lo vuelvo a eviar se queja por ser el mismo mail pero no muestra un mensaje amigable
-----
## Previniendo usuarios duplicados
- Extraigo con desestructuración el email del req.body en el controller, dentro de la funcion registrar 
- Creo una variable llamada existeUsuario.
    - Uso el await
    - Mongoose tiene muchos métodos para interactuar con la DB
    - findOne buscara hasta dar con un match
    - Hago el if, imprimo el error
    - Le paso el objeto de email
- usuarioController
~~~js
import Usuario from '../models/Usuario.js'

const registrar = async (req,res)=>{

    const {email} = req.body
    const existeUsuario =  await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg:error.message})
    }
    
    try {
        const usuario = new Usuario(req.body)
        
        const usuarioAlmacenado= await usuario.save()
        res.json({msg:"Usuario almacenado!"})

    } catch (error) {
        console.log(error)
    }


}

export {
    registrar
}
~~~