import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tareas.js'



const agregarTarea = async (req,res)=>{
    const {proyecto} = (req.body)

    const existeProyecto = await Proyecto.findById(proyecto)



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

const cambiarEstado = async (req,res)=>{
    
}

export{
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}