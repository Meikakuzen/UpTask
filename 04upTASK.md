# Creando un endpoint para confirmar cuentas

- Incluyo el endpoint "/confirmar" con el método get en usuarioRoutes.js. Cómo segundo parámetro la función (que todavía no existe) confirmar
    - Notar que es routing dinámico, ya que el token se expresa cómo comodín
- La inicializo con async en usuarioController, la exporto y l aimporto en usuarioRoutes
~~~js
const confirmar = async(req, res)=>{
    console.log("Routing dinámico")
}


export {
    registrar, 
    autenticar,
    confirmar
}

~~~

- usuarioRoutes.js
~~~js
const router = express.Router()



router.post("/", registrar) //crea un nuevo usuario
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)


export default router
~~~
---
- Si ahora en POSTMAN pongo el endpoint confirmar/20 me devuelve en consola Routing dinámico
- Para extraer los datos de la url uso req.params

~~~js
const confirmar = async(req, res)=>{
    console.log(req.params.token)
}
~~~

- Extraigo con desestructuración el token
- De nuevo uso el método findOne y le paso el token
~~~js
const confirmar = async(req, res)=>{
    const {token} = req.params

    const usuarioConfirmar = await Usuario.findOne({token})
    console.log(usuarioConfirmar)
}
~~~
- Si ahora pongo el token que copio de Compass de uno de los usuarios me imprime en consola el usuario con su id, token y todo
- Manejo el error en el controller.

~~~js
const confirmar = async(req, res)=>{
    const {token} = req.params

    const usuarioConfirmar = await Usuario.findOne({token})
    if(!usuarioConfirmar){
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})
    }
}
~~~
- Uso un try catch una vez tengo confirmado el usuario
    - confirmado pasa a ser true
    - Cómo va a ser un token de un solo uso lo elimino con un string vacío

- usuarioController.js
~~~js
const confirmar = async(req, res)=>{
    const {token} = req.params

    const usuarioConfirmar = await Usuario.findOne({token})
    if(!usuarioConfirmar){
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})
    }
    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token= ""
        await usuarioConfirmar.save();
        res.json({msg: "Usuario confirmado correctamente"})


    } catch (error) {
        console.log(error)
    }
}

~~~
# Resetear Passwords
- No se puede revertir la cadena hasheada. Para resetear el password habrá que hacer el proceso con un nuevo token
- Añado el endpoint de 'olvide-password'. Es de tipo POST porque el usuario va a enviar su email, y se va a comprobar que ese mail exista ye sté confirmado
- usuarioRoutes.js
~~~js
const router = express.Router()



router.post("/", registrar) //crea un nuevo usuario
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword )


export default router
~~~
- Creo la función olvidePassword en usuarioController
- Copio y pego el código para confirmar usuario
- Añado el endpoint a POSTMAN
- En caso de que el usuario exista lo manejo con un try catch
- Genero un nuevo token con generarId
- usuarioController.js
~~~js
const olvidePassword = async (req,res)=>{
    const {email} = req.body
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    try {
        usuario.token= generarId()
        await usuario.save()
        res.json({msg: "Hemos enviado un email con las instrucciones"})
        
    } catch (error) {
        
    }

}
~~~
# Validando el token

- Creo una nueva ruta para validar el token y resetear el password
- Va a comprobar que el token sea válido y el usuario exista. Es lo único que va a hacer. Lo próximo será almacenar un nuevo password
- Extraigo el token de la url con req.params
- Uso de nuevo findOne para buscar si existe en la base de datos
- Si el usuario existe posteriormente se le enviará un formulario para resetear el password
- usuarioController.js
~~~js
const comprobarToken = async(req, res)=>{
    const {token} = req.params
    const tokenValido = await Usuario.findOne({token})

    if(tokenValido){
        res.json({msg:"Token válido, el usuario existe"})
    }else{
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})
    }
}
~~~
----
# Almacenando el nuevo password
- Creo el nuevo endpoint de tipo POST con la función nuevoPassword
- Como apuntan al mismo sitio se puede usar router.route()
- usuarioRoutes.js
~~~js
const router = express.Router()



router.post("/", registrar) //crea un nuevo usuario
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword )
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

export default router
~~~
- Extraigo el token de la url con req.params y el password del body con req.body
- usuarioController.js
~~~js
const nuevoPassword= async (req,res)=>{
    const {token} = req.params
    const {password}= req.body

    console.log(token)
    console.log(password)
}
~~~
- Ahora si voy a POSTMAN con el endpoint con un token válido me aparece en consola el token y el password que envio desde el body en POSTMAN
- Copio y pego el mismo código de tokenValido pero lo cambio por la variable usuario

~~~js
const nuevoPassword= async (req,res)=>{
    const {token} = req.params
    const {password}= req.body
    
    const usuario = await Usuario.findOne({token})
    
    if(usuario){
        console.log(usuario)
    }else{
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})
    }
   
}
~~~

- Ahora si le doy al send en POSTMAN me aparece el usuario en consola ( por el console.log ). Está todo bien
- Entonces, reescribo el password con el req.body
- Como el password no está modificado, pasa a lo siguiente (en UsuarioSchema, el pre('save')) con el next( ), que es generar un nuevo salt para hashear el password
- Hay que eliminar el token
~~~js

const nuevoPassword= async (req,res)=>{
    const {token} = req.params
    const {password}= req.body
    
    const usuario = await Usuario.findOne({token})
    
    if(usuario){
        usuario.password = req.body
        usuario.token=""
        await usuario.save()
        res.json({msg:"Password almacenado correctamente"})
    }else{
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})

    }
   
}

~~~
- Es mejor ponerlo dentro de un try catch

~~~js

const nuevoPassword= async (req,res)=>{
    const {token} = req.params
    const {password}= req.body
    
    const usuario = await Usuario.findOne({token})
    
    if(usuario){
        usuario.password = password
        usuario.token=""

    try {
        await usuario.save()
        res.json({msg:"Password almacenado correctamente"})
        
    } catch (error) {
       console.log(error) 
    }
    }else{
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})

    }
   
}

~~~
# Comenzando un custom middleware

- Hay zonas que son públicas pero hay zonas que requieren estar autenticado
- Creo una carpeta llamada middleware en /Backend
- Un middleware es cada linea del archivo index.js, por ejemplo. Va a una, pasa a la siguiente, y a la siguiente
- Creo el archivo checkAuth.js y dentro del archivo una función que llamaré checkAuth
- Lo importo en usuarioRoutes
- Creo el endpoint /perfil con get para pasarle el JWT y retorne el perfil del usuario
- Primero entra al endpoint, después ejecuta el middleware y después la otra función (perfil)
- Tanto en la función perfil( en usuarioController ) como en la de checkAuth he puesto un console.log "desde X"
- usuarioRoutes
~~~js
const router = express.Router()

router.post("/", registrar) //crea un nuevo usuario
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword )
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)
router.get('/perfil', checkAuth, perfil)

export default router
~~~
- Si ahora hago una petición get a /perfil desde POSTMAN me devuelve "desde checkAuth" pero no aparece lo del controlador que es "desde perfil"
- checkAuth toma req, res pero también next, que permite pasar al siguiente middleware
- checkAuth
~~~js
const checkAuth = (req, res, next)=>{
    console.log("desde checkAuth.js")
    next()
}

export default checkAuth
~~~
- Ahora, si hago la petición GET a /perfil desde POSTMAN me imprime los dos console.log, el de checkAuth y el de perfil   
- En este custom middleware voy a estar revisando que el usuario esté autenticado y que el JSONWebToken sea válido

# Custom middleware

- checkAuth.js
~~~js
const checkAuth = (req, res, next)=>{
    console.log(req.headers.authorization)
    next()
}

export default checkAuth
~~~
- Este console.log da undefined. Usualmente es en los headers dónde se va a enviar el JWT. Los headers es lo que se envia primero
- EN POSTMAN hay una pestañita que dice autorization. Añado Bearer Token y en la pestañita añado el token que consigo en POSTMAN haciendo un request a /login
- Ahora puedo ver en consola que tengo Bearer a la izquierda y el token a la derecha. Me interesa solo la derecha
- Para ello uso split( ) para dividir por espacios en un arreglo y le indico que el token esta en la posición 1
~~~js
const checkAuth = (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            console.log(token)
        } catch (error) {
            console.log(error)
            
        }
    }

    next()
}

export default checkAuth
~~~

- Importo la librería de jwt que me permite verificar( descifrar ) el JSONWebToken
- Como segundo parametro le paso la misma variable de entorno que usé para generar el salt
- checkAuth.js
~~~js
import jwt from 'jsonwebtoken'

const checkAuth = (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            
            const decoded= jwt.verify(token, process.env.JWT_SECRET)
            console.log(decoded)
        } catch (error) {
              return res.status(404).json({msg: "Hubo un error"})
            
        }
    }

    next()
}

export default checkAuth
~~~
- Transformo en async la función para usar el await
- El JWT tiene el id del usuario, 
- Importo el Usuario de models.
- Agrego una nueva variable en el req. y le paso al método findById decoded.id, porque es lo que está extrayendo del token en decoded
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
            req.usuario= await Usuario.findById(decoded.id)
            console.log(req.usuario)
        } catch (error) {
            return res.status(404).json({msg: "Hubo un error"})
            
        }
    }

    next()
}

export default checkAuth
~~~
- Si hago la petición GET con el TOKEN de autenticación el console.log de req.usuario me devuelve algo asi
~~~
{
  _id: new ObjectId("6303ab39029bae8dff989ff5"),
  nombre: 'Pepito',
  password: '$2b$10$GHvRXh9Mf5CczsSHFPe3lOIM7sy.z3tXdcDAJWrZtEnz78EOG.0CG',
  email: 'correo@correo.com',
  confirmado: true,
  token: 'os5uj9uohbo1gb5gg83f',
  createdAt: 2022-08-22T16:13:45.953Z,
  updatedAt: 2022-08-23T14:08:03.706Z,
  __v: 0
}
~~~
- Para eliminar el password uso select en req.usuario

~~~js
const checkAuth = async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            console.log(token)
            const decoded= jwt.verify(token, process.env.JWT_SECRET)
            req.usuario= await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt  -__v")
            
            return next();
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
~~~

- Le coloco return next( ) porque una vez que se verificó el JWT y se le asignó al req paso al siguiente middleware
- Si no hay un token pasaré un nuevo error
- Este middleware verifica el token y da paso a perfil si todo esta bien
- En el controlador configuro perfil para que me devuelva el usuario
~~~js
const perfil =async (req,res)=>{
    const {usuario} = req
    res.json(usuario)
}
~~~



