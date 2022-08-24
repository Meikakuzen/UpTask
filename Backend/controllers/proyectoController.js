import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tareas.js'

const obtenerProyectos= async(req,res)=>{
   const proyectos = await Proyecto.find().where('creador').equals(req.usuario)
   res.json(proyectos)
}

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


}//MARCA ERROR

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

const agregarColaborador = (req,res)=>{

}

const eliminarColaborador = (req,res)=>{

}

{/*const obtenerTareas = async(req,res)=>{
    const {id} = req.params

    const existeProyecto = await Proyecto.findById(id)

    if(!existeProyecto){
        const error = new Error("El proyecto no existe o no se encuentra")
        return res.status(404).json({msg: error.message})
    }

    const tareas = await Tarea.find().where("proyecto").equals(id)
    res.json(tareas)
}*/}

export{
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador
}