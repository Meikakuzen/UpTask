# Creando el modelo para proyectos
- Lo primero importo mongoose
- Añado el Schema
- En creador establezco una relación con el id del usuario
- Lo que hay en ref es de donde va a obtener esta referencia, en este caso es de Usuario= mongoose.model(**"Usuario"**, usuarioSchema)
- Colaboradores es un arreglo de usuarios
- Al final, el timestamps en true crea las dos filas de cuando fue creado y actualizado
~~~js
import mongoose from 'mongoose'

const proyectoSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        required: true
    },
    descripcion:{
        type: String,
        trim: true,
        required: true
    },
    fechaEntrega:{
        type: Date,
        default: Date.now()
    },
    cliente:{
        type: String,
        trim: true,
        required: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    colaboradores:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    ]
}, {
    timestamps: true
})

const Proyecto= mongoose.model('Proyecto', proyectoSchema)

export default Proyecto
~~~
----
- Creo proyectoController.js y creo una función con req, res que es la que traerá los proyectos de la persona autenticada
- Creo el cascaron de las funciones que usaré. Exporto todo
~~~js
const obtenerProyectos= async(req,res)=>{

}

const nuevoProyecto= async (req,res)=>{
    console.log(req.body)
}

const obtenerProyecto=async(req,res)=>{

}

const editarProyecto = async(req, res)=>{

}

const eliminarproyecto = async(req,res)=>{

}

const agregarColaborador = (req,res)=>{

}

const eliminarColaborador = (req,res)=>{

}

const obtenerTareas = async(req,res)=>{
    
}


export{
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarproyecto,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas
}
~~~
-----

- En /routes creo proyectoRoutes y las importo todas
- Importo también checkAuth y express. Declaro el router
~~~js
import {obtenerProyectos,
nuevoProyecto,
obtenerProyecto,
editarProyecto,
eliminarProyecto,
agregarColaborador,
eliminarColaborador,
obtenerTareas} from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js'
import express from 'express'

const router = express.Router()




export default router;
~~~
-----

- Añado el endpoint de proyectos en el index.js que está en la raiz
~~~js
import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express()

dotenv.config()
app.use(express.json())

conectarDB()

//ROUTING

app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", usuarioRoutes) //aquí irá proyectoRoutes





const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
~~~
-----
- Como inicio, en proyectoRoutes.js hago una petición GET de obtenerProyectos. Le añado el middleWare de autenticación
- Como comparten la raíz con la petición post los incluyo en router.route

~~~js

const router = express.Router()


router.route('/')
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto)

export default router;
~~~
-----
- ObtenerProyecto, editar y eliminar requieren el id.
~~~js
router.route('/:id')
    .get(checkAuth,obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto)
~~~
-----
- Añado los endpoints que faltan a proyectoRoutes.js
~~~js
import {obtenerProyectos,
nuevoProyecto,
obtenerProyecto,
editarProyecto,
eliminarProyecto,
agregarColaborador,
eliminarColaborador,
obtenerTareas} from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js'
import express from 'express'

const router = express.Router()


router.route('/')
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto)

router.route('/:id')
    .get(checkAuth,obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto)

router.get('/tareas/:id', checkAuth, obtenerTareas)
router.post('/agregar-colaborador/:id', agregarColaborador)
router.delete('/eliminar-colaborador/:id', checkAuth, eliminarColaborador)


export default router;
~~~
-----

# Creando Proyectos

- Falta importar proyectoRoutes en el index.js y añadirlo al endpoint

~~~js
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
~~~
-----
- Le coloco un console.log(req.body) a nuevoProyecto en proyectoController.js
- Abro POSTMAN y apunto a proyectos con una petición POST. Abro body, raw, json y escribo el body
- Relleno los campos según el schema. El de la fecha no porque ya tiene Date.now(). Creador y colaboradores no los voy a mandar
- Esto es lo que escribo en el body/raw/json en POSTMAN

~~~js
{
    "nombre": "tienda virtual",
    "descripcion": "Tienda virtual para un cliente",
    "cliente": "códigonuevo"
}
~~~
------

- El usuario debe de estar autenticado para la petición, asi que debo abrir auth, bearer Token y colocarle el token

~~~js
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';

const checkAuth = async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            console.log(token)
            const decoded= jwt.verify(token, process.env.JWT_SECRET)
            req.usuario= await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt  -__v")
        
            return next()

        } catch (error) {
            return res.status(404).json({msg: "Hubo un error"})
            
        }
    }
    if(!token){
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})
    }

    next()
}

export default checkAuth
~~~

----
- Ahora puedo ver gracias al console.log de req.body en NuevoProyecto(), el json que he escrito en POSTMAN en consola
- Importo Proyecto de /models a proyectoController
