## Hashear los passwords
- Para hashear los passwords instalo bcrypt
> npm i bcrypt

- En Usuario.js, a usuarioSchema le añado la función pre y como primer parametro 'save', para que lo que sea que haga lo haga antes de guardar
- Como segundo parámetro le añado una función anónima con el parámetro next( de express )
    - Este codigo se va a ejecutar antes de salvar el registro en la DB. Se usa function en lugar de una arrow para poder usar el this
- Uso la función de mongoose isModified con el this.password, para que compruebe si el password se ha modificado previamente
    - Si ya se hubiera hasheado antes y se volviera a hashear no daría match
    - Como parámetro le paso el password y en el cuerpo next( ) que es para mandar pasar al siguiente middleware
- A continuación genero la encriptación
    - Necesita un salt. 10 rondas de hasheo como parámetro es el standard, da suficiente seguridad
    - Hago referencia al password con this.password y con la función de bcrypt.hash le paso el password cómo primer parámetro y el salt cómo segundo
    - Lo hago async await para que se tome su tiempo y bloquee el código hasta que tenga una respuesta

~~~js
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

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


usuarioSchema.pre('save', async function(next){ 
   if(!this.isModified('password')){ 
    next()
   } 
    const salt = await bcrypt.genSalt(10) 
    this.password = await bcrypt.hash(this.password, salt) 
})

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario

~~~
------
- Creo una carpeta llamada helpers en /Backend con un archivo llamado generarId
- Quiero generar un id de manera random.
- El 32 del toString se le conoce cómo el radix
- El substring es para quitarle los dos primeros caracteres 
- Concatenando Math.random con toString se obtiene una cadena de caracteres mezclando números y letras 
- Junto con Date.now generará un ID lo suficientemente complejo

~~~js
const generarId =()=>{
    //variable random

    const random = Math.random().toString(32).substring(2)
    const fecha= Date.now().toString(32) 

    return random+fecha


}

export default generarId
~~~
----
- Importo generarId en el controlador (usuarioController.js)
- En el try, antes de que guarde con el .save( )  pasamos el generarId( ) al usuario.token

~~~js
import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js'

const registrar = async (req,res)=>{

    const {email} = req.body
    const existeUsuario =  await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg:error.message})
    }
    
    try {
        const usuario = new Usuario(req.body)
        usuario.token= generarId()
        
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
----
## creando el endpoint de autenticación
- Creo un nuevo endpoint con una función aún por definir a la que llamaré autenticar
~~~js
import express from 'express'
import {registrar} from '../controllers/usuarioController.js'
import Usuario from '../models/Usuario.js'


const router = express.Router()



router.post("/", registrar) //crea un nuevo usuario
router.post('/login', autenticar)



export default router

~~~
----
- Este 'login' lo suma al /api/usuarios que tengo en el index.js
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





const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
~~~
-----



- Defino la función autenticar en el controlador ( UsuarioController.js )

- Creo el endpoint POST http://localhost:4000/api/usuarios/login en POSTMAN y lo guardo como autenticar usuarios
- En environments ( a la izquierda ) aprieto + par aañadir un nuevo ambiente ( me permitirá almacenar variables )
- Lo llamo upTask, ahora a la derecha, cuando voy a colecciones, puedo ver No Environment. Ahí selecciono upTask
- Para definir una variable, clicar en el ojo de arriba a la derecha y en Edit
- Otra opción para guardar una variable es seleccionar la url que quieres guardar y aparece automáticamente set as variable
----
# Autenticar 
- Primero comprobar si el usuario existe
- Segundo comprobar si el usuario esta confirmado
- Comprobar el password

- Para autenticar el usuario voy a enviar en formato JSON con POSTMAN el email y el password
- En el usuarioController, en la función de autenticar, extraigo con destructuring el email y el password
- Paso a hacer la búsqueda por mail con el método de mongoose findOne
- Añado el posible error en caso de que el usuario no exista
~~~js

const autenticar =async (req, res)=>{
    const {email, password } = req.body
    const usuario = await Usuario.findOne({email})

        if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
}

~~~
-----
- Ahora hay que comprobar si el usuario está confirmado. Es un código muy parecido al anterior. Como es un objeto, uso la notación de punto

~~~js
const autenticar =async (req, res)=>{
    const {email, password } = req.body
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(404).json({msg: error.message})
    }
}
~~~
----
# Comprobando el password

- Crear una función que compruebe el pàssword en Usuario
- de nuevo usaré function porque usaré el this
- En el controlador, dentro de autenticar estoy extrayendo el password, entonces llamaré la función ahi
- Para comparar los passwords tengo bcrypt.compare, y le paso el dato y el password

~~~js
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}
~~~

- En el controlador voy a usar el await, para esperar que se ejecute este método que devuelve true o false
- Cómo he creado el metodo, puedo usarlo en la instancia del usuario.
- Cómo el usuario si llega hasta aquí ya está confirmado, entonces tengo acceso a los datos del this.password
- Le paso el password en el controller

~~~js

const autenticar =async (req, res)=>{
    const {email, password } = req.body
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(404).json({msg: error.message})
    }
    if(await usuario.comprobarPassword(password)){
        console.log("Es correcto")
    }else{
        const error = new Error("El password es incorrecto")
        return res.status(404).json({msg: error.message})
    }

    
}
~~~
-----
### NOTA: debo cambiar la cuenta a confirmada en COMPASS para que el endpoint a login en POSTMAN funcione

- Para obtener una mejor respuesta en postman cuando el password es correcto, la formateo
- El id es con un guión bajo porque así lo maneja mongo
~~~js

const autenticar =async (req, res)=>{
    const {email, password } = req.body
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(404).json({msg: error.message})
    }
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        })
    }else{
        const error = new Error("El password es incorrecto")
        return res.status(404).json({msg: error.message})
    }

    
}
~~~
----
# Cómo generar un JSON WEB TOKEN


- Instalar jsonwebtoken
> npm i jsonwebtoken
- En la carpeta helpers creo el file generarJWT.js
    - Importo jwt 
    - .sign( ) es un método que permite generar un JWT, de froma sincrona va a firmar el payload que le estas enviando al JWT
    - Como primer parámetro tiene un objeto (lo que va a colocar en el JWT), como segundo la llave privada se tiene que almacenar en las variables de entorno
    - Se recomienda poner una cadena compleja. Lo almaceno en .env
    - Como tercer parámetro toma un objeto con opciones
    - expiresIn es cuanto tiempo estará vigente el token. Le pongo 30 días
- Importo generarJWT en el controller
- Lo añado a la respuesta que estoy generando
- .env
~~~
MONGO_URI=mongodb+srv://isma:isma@cluster0.82so450.mongodb.net/?retryWrites=true&w=majority

JWT_SECRET= palabraSECRETA
~~~
- generarJWT
~~~js
import jwt from 'jsonwebtoken'

const generarJWT =()=>{
    return jwt.sign({nombre: "Juan"}, process.env.JWT_SECRET,{
        expiresIn:'30d'
    })

}

export default generarJWT

~~~
-----

- Uso POSTMAN para visualizar en la respuesta el token. Puedo copiarlo y pegarlo en la web JWT para ver la info en el JWT
- Lo que me interesa es incluir el id.
- Voy al usuario controller y lo meto como parámetro en generarJWT
- usuarioController.js
~~~js
import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js'
import generarJWT from '../helpers/generarJWT.js'

const registrar = async (req,res)=>{

    const {email} = req.body
    const existeUsuario =  await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg:error.message})
    }
    
    try {
        const usuario = new Usuario(req.body)
        usuario.token= generarId()
        
        const usuarioAlmacenado= await usuario.save()
        res.json({msg:"Usuario almacenado!"})

    } catch (error) {
        console.log(error)
    }


}

const autenticar =async (req, res)=>{
    const {email, password } = req.body
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(404).json({msg: error.message})
    }
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("El password es incorrecto")
        return res.status(404).json({msg: error.message})
    }

    
}


export {
    registrar, 
    autenticar
}

~~~
----
- Debo pasarle el id como parámetro a la función e incluirla en el objeto
- generarJWT.js
~~~js

import jwt from 'jsonwebtoken'

const generarJWT =(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'30d'
    })

}

export default generarJWT

~~~
