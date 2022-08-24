# Crear Modelo Tareas

- Cada tarea va a estar asociada a un proyecto. Por eso los relaciono y le paso de referencia el modelo de Proyecto
- Finalmente declaro el modelo y lo exporto por default
~~~js
import mongoose from 'mongoose'
 


const tareaSchema = mongoose.Schema({
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
    estado:{
        type: Boolean,
        default: false
    },
    fechaEntrega:{
        type: Date,
        required: true,
        default: Date.now()
    },
    prioridad:{
        type: String,
        required: true,
        enum:["Baja", "Media", "Alta"]
    },
    proyecto:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "Proyecto"
    }
 },{
    timestamps: true
 })

 const  Tarea = mongoose.model("Tarea", tareaSchema)

 export default Tarea
 ~~~
 ----
- Creo tareaController.js y tareaRoutes.js
- Declaro las funciones en el controlador
~~~js
const agregarTarea = async (req,res)=>{

}

const obtenerTarea = async (req,res)=>{
    
}

const actualizarTarea = async (req,res)=>{
    
}
const eliminarTarea = async (req,res)=>{
    
}

const cambiarEstado = async (req,res)=>{
    
}

export{
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}
~~~
-----
- Las importo en tareaRoutes.js. ( Recuerda poner la extensión .js!!!)
    - Importo express y checkAuth para la autenticación
~~~js
import{
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
} from '../controllers/tareaController.js'
import express from 'express'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()

router.post('/', checkAuth, agregarTarea)
router.route('/:id')
.get(checkAuth, obtenerTarea)
.put(checkAuth, actualizarTarea)
.delete(checkAuth, eliminarTarea)

router.post('/estado/:id', checkAuth, cambiarEstado)

export default router
~~~
-----

- Importo el archivo proyectoRoutes en el index.js

~~~js
import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express()

dotenv.config()
app.use(express.json())

conectarDB()

//ROUTING

app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes)
app.use("/api/tareas", tareaRoutes)





const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
~~~
----
- Empiezo por el endpoint de agregarTarea. En POSTMAN, tipo PUT, me aseguro de que el TOKEN del usuario esté relacionado a algun proyecto existente suyo
- Pongo esto en el cuerpo, siguiendo el modelo creado previamente
~~~js
{
    "nombre": "Elegir colores",
    "descripcion": "Elegir colores acordes a la reunión",
    "prioridad": "Media",
    "proyecto": "630507d6e8132e9b17d31421"
}
~~~
----
- Le pongo un console.log(req.body) a agregarTarea( ) para comprobar que se comunique bien con el endpoint
- Si todo esta correcto, lo siguiente es importar el modelo de Proyecto para comprobar que el proyecto exista
- Extraigo proyecto de req.body y uso el método findById. Lo imprimo en consola
~~~js

const agregarTarea = async (req,res)=>{
    const {proyecto} = (req.body)

    const existeProyecto = await Proyecto.findById(proyecto)

    console.log(existeProyecto)
}
~~~
---
- Manejo el error
~~~js
const agregarTarea = async (req,res)=>{
    const {proyecto} = (req.body)

    const existeProyecto = await Proyecto.findById(proyecto)

    console.log(existeProyecto)

    if(!existeProyecto){
        const error = new Error('El proyecto no existe')
        await res.status(404).json({msg: error.message})
    }
}
~~~
----
- Añado la comprobación de que el creador es el mismo que el usuario que solicita
~~~js

const agregarTarea = async (req,res)=>{
    const {proyecto} = (req.body)

    const existeProyecto = await Proyecto.findById(proyecto)

    console.log(existeProyecto)

    if(!existeProyecto){
        const error = new Error('El proyecto no existe')
        await res.status(404).json({msg: error.message})
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos adecuados")
        return res.status(404).json({msg: error.message})
    }
}
~~~
----
- Si pasa las validaciones, puedo pasar a almacenarlo con un try catch
- Lo puedo hacer con new tarea o con mongoose se puede hacer de la siguiente forma
- Debo importar Tarea de models

~~~js
const agregarTarea = async (req,res)=>{
    const {proyecto} = (req.body)

    const existeProyecto = await Proyecto.findById(proyecto)

    console.log(existeProyecto)

    if(!existeProyecto){
        const error = new Error('El proyecto no existe')
        await res.status(404).json({msg: error.message})
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos adecuados")
        return res.status(404).json({msg: error.message})
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        res.json(tareaAlmacenada)

    } catch (error) {
        console.log(error)
    }
}
~~~
----
- Solo quien creo el proyecto es quien puede añadir tareas. Los colaboradores pueden cambiar el estado de las tareas
# Obtener una tarea y validación
- Obtener tarea requiere un id
- En POSTMAN, petición GET al id de la tarea ( recordar el TOKEN válido)
- Puedo poner un console.log en obtenerTarea para ver si se comunican satisfactoriamente
- Extraigo el id con desestructuración. Hay que asegurarse que la tarea pertenece a un proyecto de la persona que está autenticada
~~~js

const obtenerTarea = async (req,res)=>{
    const {id} = req.params 
    
    const tarea = await  Tarea.findById(id)

     console.log(tarea)

}
~~~
---
- Puedo usar .populate para cruzar la información con el proyecto asociado en el schema. De esta forma hago solo una consulta y me devuelve la tarea y el proyecto.
~~~js
const obtenerTarea = async (req,res)=>{
    const {id} = req.params 
     const tarea = await  Tarea.findById(id).populate("proyecto")

     console.log(tarea)

}
~~~
----
- Se requiere comprobar quien es el creador.
~~~js

const obtenerTarea = async (req,res)=>{
    const {id} = req.params 
     const tarea = await  Tarea.findById(id).populate("proyecto")

     if(tarea.proyecto.creador.toString() !==  req.usuario._id.toString()){
        const error = new Error("No tienes los permisos para acceder a la tarea")
        return res.status(404).json({msg: error.message})
     }
     res.json(tarea)
}

~~~
- Ahora postman me devuelve algo así
~~~js
{
    "_id": "630622278533b7da996f8ae0",
    "nombre": "Elegir colores",
    "descripcion": "Elegir colores acordes a la reunión",
    "estado": false,
    "fechaEntrega": "2022-08-24T13:05:39.341Z",
    "prioridad": "Media",
    "proyecto": {
        "_id": "630507d6e8132e9b17d31421",
        "nombre": "tienda virtual",
        "descripcion": "Tienda virtual para un cliente",
        "fechaEntrega": "2022-08-23T17:01:07.369Z",
        "cliente": "códigonuevo",
        "colaboradores": [],
        "creador": "6303ab39029bae8dff989ff5",
        "createdAt": "2022-08-23T17:01:10.624Z",
        "updatedAt": "2022-08-23T17:01:10.624Z",
        "__v": 0
    },
    "createdAt": "2022-08-24T13:05:43.779Z",
    "updatedAt": "2022-08-24T13:05:43.779Z",
    "__v": 0
}
~~~
-------
- Manejo del error si la tarea no existe
~~~js
const obtenerTarea = async (req,res)=>{
    const {id} = req.params 
     const tarea = await  Tarea.findById(id).populate("proyecto")

     if(!tarea){
         const error = new Error("La tarea no existe o no se encuentra")
         return res.status(404).json({msg: error.message})  
     }

     if(tarea.proyecto.creador.toString() !==  req.usuario._id.toString()){
        const error = new Error("No tienes los permisos para acceder a la tarea")
        return res.status(403).json({msg: error.message})
     }
     res.json(tarea)
}
~~~
----
# Actualizar Tarea

- Hay que verificar la tarea, ver si existe, y verificar que el usuario tenga los permisos necesarios
- En un try catch guardo los cambios de la petición PUT

~~~js
const actualizarTarea = async (req,res)=>{

        const {id} = req.params 
         const tarea = await  Tarea.findById(id).populate("proyecto")
    
         if(!tarea){
             const error = new Error("La tarea no existe o no se encuentra")
             return res.status(404).json({msg: error.message})  
         }
    
         if(tarea.proyecto.creador.toString() !==  req.usuario._id.toString()){
            const error = new Error("No tienes los permisos para acceder a la tarea")
            return res.status(403).json({msg: error.message})
         }
         
         tarea.nombre = req.body.nombre || tarea.nombre;
         tarea.descripcion = req.body.descripcion || tarea.descripcion;
         tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
         tarea.prioridad = req.body.prioridad || tarea.prioridad;
         
         try {

            const tareaAlmacenada = await tarea.save()
            res.json(tareaAlmacenada)

         } catch (error) {
            console.log(error)
         }
    
}
~~~
---
- Retorno del servidor la tareaAlmacenada porque luego en el frontEnd lo voy a sincronizar con el state
# Eliminar Tarea
- Las mismas comprobaciones pero se hace la petición DELETE
~~~js
const eliminarTarea = async (req,res)=>{
    const {id} = req.params 
    const tarea = await  Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error("La tarea no existe o no se encuentra")
        return res.status(404).json({msg: error.message})  
    }

    if(tarea.proyecto.creador.toString() !==  req.usuario._id.toString()){
       const error = new Error("No tienes los permisos para acceder a la tarea")
       return res.status(403).json({msg: error.message})
    }
    try {
        await tarea.deleteOne()
        res.json({msg: "Tarea eliminada"})
    } catch (error) {
        console.log(error)
    }
}
~~~
----
- Si ahora en POSTMAN voy al endpoint tareas/id_de_una_tarea con DELETE, borra dicha tarea
- Cambiar estado es algo que los colaboradores si van a poder hacer , por lo que se hará más adelante
----
# Obtener tareas
- Listar las tareas de un proyecto puede estar en proyectoController pero tambien en tareaController
- Tengo el endpoint de tareas/:id, este id es del proyecto
- Monto el endpoint en POSTMAN
- Para obtener las tareas tienes que ser el creador del proyecto o colaborador/a
- Se podría hacer así
~~~js
const obtenerTareas = async(req,res)=>{
    const {id} = req.params

    const existeProyecto = await Proyecto.findById(id)

    if(!existeProyecto){
        const error = new Error("El proyecto no existe o no se encuentra")
        return res.status(404).json({msg: error.message})
    }

    const tareas = await Tarea.find().where("proyecto").equals(id)
    res.json(tareas)
}
~~~
- Para no hacer dos llamados http, me puedo traer un campo extra en proyecto con las tareas asociadas y filtrarlas en el controlador
    - En obtenerProyecto de proyectoController
    - Es correcto que cuando me traiga el proyecto me traiga también las tareas asociadas a ese proyecto
~~~js
const obtenerProyecto=async(req,res)=>{
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

    const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)
    
    res.json({
        proyecto,
        tareas
    })


}//MARCA ERROR el if(!proyecto)

~~~
- Manejándolo desde aquí ya no es necesario el obtenerTareas.
- Elimino el endpoint y las importaciones
- El arreglo de colaboradores en el schema de proyecto va a ser un arreglo que almacene el id de cada colaborador