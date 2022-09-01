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

- En /routes creo proyectoRoutes.js y las importo todas
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
- Como es un export default lo puedo llamar como quiera

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
- Ahora puedo ver gracias al console.log de req.body en NuevoProyecto(), el json que he escrito en POSTMAN en la consola
- A NuevoProyecto le puedo añadir un console.log(req.usuario) porque tengo un usuario autenticado con el checkAuth
- Importo Proyecto de /models
- Creo una nueva instancia de proyecto con el req.body
~~~js
const nuevoProyecto= async (req,res)=>{
    
    const proyecto= new Proyecto(req.body)
    
    proyecto.creador= req.usuario._id
}
~~~
-----
- Una vez almacenado voy a regresar el proyecto almacenado. Uso un try y un catch
~~~js
const nuevoProyecto= async (req,res)=>{
   
   const proyecto= new Proyecto(req.body)
   
   proyecto.creador= req.usuario._id

    try {
        
        const proyectoAlmacenado = await proyecto.save()
        
        res.json(proyectoAlmacenado)
    
    } catch (error) {
       
       console.log(error)
    }
}

~~~
-----
- Esto crea el proyecto en la DB. El resto de info que no agregué en el body de POSTMAN lo agrega express por su cuenta
- Genero un nuevo token de otro usuario con autenticar usuario y lo uso como auth en POSTMAN para publicar un nuevo proyecto que pongo en formato json en el body/raw/json de POSTMAN. Añado nombre, descripción y cliente

# Obtener los proyectos de los usuarios autenticados

- En POSTMAN hago una petición GET a /api/proyectos, el endpoint de obtenerProyectos en proyectosRouter. Debo hacerlo con la autorización TOKEN
- Escribo en la función del controller obtenerProyectos.js
~~~js
const obtenerProyectos= async(req,res)=>{
   
   const proyectos = await Proyecto.find()
   
   res.json(proyectos)
}
~~~
-----
- Me trae todos los proyectos. Tiene que traer sólo los del usuario que ha realizado la petición (autenticado)
- En todos los endpoints que tienen el checkAuth como middleware dispongo de req.usuario para identificar que usuario esta autenticado
- Puedo hacer una consulta con mongoose algo más avanzada
~~~js
const obtenerProyectos= async(req,res)=>{
  
  const proyectos = await Proyecto.find().where('creador').equals(req.usuario)
  
  res.json(proyectos)
}
~~~
-----

# Obtener y validar un proyecto por su ID
- Con el id de proyecto ( que puedo consultar en Compass ) es con lo que voy a hacer la consulta desde el endpoint
- Cómo tiene router dinámico('/:id'), accedo con req.params haciendo desestructuración
~~~js
const obtenerProyecto= async(req,res)=>{
    
    const {id} = req.params
    
    console.log(id)
}
~~~
- Le añado un console.log para comprobar que extraigo el id. Hago la consulta GET en POSTMAN con el id de una tarea en el endpoint
- Uso el método findById y manejo el error
~~~js
const obtenerProyecto=async(req,res)=>{
    const {id} = req.params
    
    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto){
        
        return res.status(404).json({msg:"No encontrado"})
    }

    res.json(proyecto)
}
~~~
------
## NOTA: el código de if(!proyecto) da error. Se corrige más adelante en la parte del FRONTEND
----
- Si comparo proyecto.creador === req.usuario._id me da false. Incluso si uso solo ==. Debo transformar los dos a string
- Hago una comparación para confirmar si el creador coincide con el id del usuario
~~~js
const obtenerProyecto = async(req,res)=>{
    const {id} = req.params
  
    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto){
         
         const error= new Error("No encontrado")
       
       return res.status(404).json({msg: error.message})
    }//DA ERROR

   if(proyecto.creador.toString() !== req.usuario._id.toString()){
        
        const error = new Error("No tienes los permisos. Acción no válida")
        
        return res.status(401).json({msg: error.message})
    }
    res.json(proyecto)
}
~~~
-----

# Editar un proyecto

- Ahora apunto con POSTMAN con un PUT al proyectos/id_del_proyecto
- En la función editarProyecto tengo las mismas medidas de seguridad que en obtenerProyecto. Copio y pego
- Voy al body/raw/json para escribir el cuerpo de la actualización en POSTMAN
~~~js
const editarProyecto = async(req, res)=>{
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto){
        const error= new Error("No encontrado")
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos. Acción no válida")
        return res.status(401).json({msg: error.message})
    }
    
}
~~~
----
- Si llego hasta proyecto es que pasó todas las validaciones
- Compongo para editar
~~~js
const editarProyecto = async(req, res)=>{
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto){
        const error= new Error("No encontrado")
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos. Acción no válida")
        return res.status(401).json({msg: error.message})
    }

    proyecto.nombre      = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega= req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente     = req.body.cliente || proyecto.cliente
    
}
~~~
------
- Después uso un try catch para el producto almacenado
~~~js
const editarProyecto = async(req, res)=>{
   
   const {id} = req.params
   
   const proyecto = await Proyecto.findById(id)
    
    if(!proyecto){
       
       const error= new Error("No encontrado")
        
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
       
       const error = new Error("No tienes los permisos. Acción no válida")
       
       return res.status(401).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega= req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente
    
    try {
        const proyectoAlmacenado = await proyecto.save()
        
        res.json(proyectoAlmacenado)
   
   } catch (error) {
        
    }
}
~~~
-----
# Eliminar un proyecto
- Las consideraciones son las mismas. Leer el parámetro, identificar el proyecto por id y que el creador coincida con el usuario que loquiere borrar
- Uso el metodo deleteOne( ) de mongoose en un try catch
~~~js
const eliminarProyecto = async(req,res)=>{
    const {id} = req.params
   
   const proyecto = await Proyecto.findById(id)
    
    if(!proyecto){
       
       const error= new Error("No encontrado")
        
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        
        const error = new Error("No tienes los permisos. Acción no válida")
        
        return res.status(401).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne()
       
       res.json({msg: "Proyecto eliminado"})
    
    } catch (error) {
        
    }

}
~~~


