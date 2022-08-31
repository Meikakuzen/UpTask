# Primeros pasos para reestablecer contraseña

- mailtrap asociado a miguenovuelve
- Voy al componente OlvidePassword, en el front
- Ahi copio el header y el campo de email del componente Registrar.jsx y pongo un texto de Recuperar acceso
- Coloco tambien un link, un input tipo submit, el state del email, etc
- OlvidePassword.js:
~~~js
import {Link} from 'react-router-dom'
import {useState} from 'react'

const OlvidePassword = () => {

  const [email, setEmail]= useState('')
  return (
    <>
     <h1 className="text-sky-600 font-black text-6xl">Recupera tu acceso y no pierdas tus  
    <span className="text-slate-700"> Proyectos</span></h1>
    <form className="my-5 bg-white rounded-xl shadow-lg p-10">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="email">Email</label>
        
        <input 
         id="email"
         type="email"
         value={email} 
         onChange={e=>setEmail(e.target.value)}
         placeholder="Email de registro" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>


        <input type="submit" 
          value="Recupera tu cuenta"
          className="bg-sky-700 mb-3 text-white w-full font-bold p-2 rounded-lg mt-5 uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>

      <div className="flex justify-between">
      <Link to="/" className="block text-slate-500 text-center my-5">¿Ya tienes cuenta? Inicia sesión</Link>
      <Link to="/registrar" className="block text-slate-500 text-center my-5">¿No tienes cuenta? Crea una!</Link>

      </div>
    </form>
    </>
  )
}

export default OlvidePassword
~~~
----
- Coloco el onSubmit en el form, con una función llamada handleSubmit
- Coloco el e.preventDefault y hago una validación sencilla
- extraigo el mensaje de alerta y lo muestro de forma condicional encima del form
~~~js
import {Link} from 'react-router-dom'
import {useState} from 'react'
import Alerta from '../components/Alerta'

const OlvidePassword = () => {

  const [email, setEmail]= useState('')
  const [alerta, setAlerta] = useState({})

const handleSubmit = async(e)=>{
  e.preventDefault()
  if(email === '' || email.length < 6){
    setAlerta({
      msg: "El email es obligatorio",
      error: true
    })
    return
  }
}

const {msg} = alerta

  return (
    <>
     <h1 className="text-sky-600 font-black text-6xl">Recupera tu acceso y no pierdas tus  
    <span className="text-slate-700"> Proyectos</span></h1>
      {msg && <Alerta alerta={alerta} />}
    <form onSubmit={handleSubmit}className="my-5 bg-white rounded-xl shadow-lg p-10">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="email">Email</label>
        
        <input 
         id="email"
         type="email"
         value={email} 
         onChange={e=>setEmail(e.target.value)}
         placeholder="Email de registro" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>


        <input type="submit" 
          value="Recupera tu cuenta"
          className="bg-sky-700 mb-3 text-white w-full font-bold p-2 rounded-lg mt-5 uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>

      <div className="flex justify-between">
      <Link to="/" className="block text-slate-500 text-center my-5">¿Ya tienes cuenta? Inicia sesión</Link>
      <Link to="/registrar" className="block text-slate-500 text-center my-5">¿No tienes cuenta? Crea una!</Link>

      </div>
    </form>
    </>
  )
}

export default OlvidePassword
~~~
----
# enviando email y token para reestablecer password
- Coloco  un try catch en el handleSubmit después de la validación
- Le paso el endpoint de tipo post ( COMO EN POSTMAN ) usando axios y le paso un objeto con el mail
## NOTA: la url debería estar en una variable de entorno

~~~js
import {Link} from 'react-router-dom'
import {useState} from 'react'
import Alerta from '../components/Alerta'
import axios from 'axios'

const OlvidePassword = () => {

  const [email, setEmail]= useState('')
  const [alerta, setAlerta] = useState({})

const handleSubmit = async(e)=>{
  e.preventDefault()
  
  if(email === '' || email.length < 6){
    setAlerta({
      msg: "El email es obligatorio",
      error: true
    })
    return
  }
  try {
    const {data} = await  axios.post(`http://localhost:4000/api/usuarios/olvide-password`, {email})

    console.log(data)
    
  } catch (error) {
    console.log(error.response)
  }
}

const {msg} = alerta

  return (
    <>
     <h1 className="text-sky-600 font-black text-6xl">Recupera tu acceso y no pierdas tus  
    <span className="text-slate-700"> Proyectos</span></h1>
      {msg && <Alerta alerta={alerta} />}
    <form onSubmit={handleSubmit}className="my-5 bg-white rounded-xl shadow-lg p-10">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="email">Email</label>
        
        <input 
         id="email"
         type="email"
         value={email} 
         onChange={e=>setEmail(e.target.value)}
         placeholder="Email de registro" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>


        <input type="submit" 
          value="Recupera tu cuenta"
          className="bg-sky-700 mb-3 text-white w-full font-bold p-2 rounded-lg mt-5 uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>

      <div className="flex justify-between">
      <Link to="/" className="block text-slate-500 text-center my-5">¿Ya tienes cuenta? Inicia sesión</Link>
      <Link to="/registrar" className="block text-slate-500 text-center my-5">¿No tienes cuenta? Crea una!</Link>

      </div>
    </form>
    </>
  )
}

export default OlvidePassword
~~~
- Si mando un mail que no existe aparece en consola dentro de data.msg "Usuario no existe"
- Manejo el error con setAlerta
~~~js
const handleSubmit = async(e)=>{
  e.preventDefault()
  if(email === '' || email.length < 6){
    setAlerta({
      msg: "El email es obligatorio",
      error: true
    })
    return
  }
  try {
    const {data} = await  axios.post(`http://localhost:4000/api/usuarios/olvide-password`, {email})

    console.log(data)
    
  } catch (error) {
    setAlerta({
      msg: error.response.data.msg,
      error: true
    })
  }
}
~~~
----
- Si coloco un mail que existe me muestra un mensaje en pantalla: "Hemos enviado unmail con las instrucciones" y me genera un nuevo token
- Manejo el mensaje con setAlerta
~~~js
const handleSubmit = async(e)=>{
  e.preventDefault()
  if(email === '' || email.length < 6){
    setAlerta({
      msg: "El email es obligatorio",
      error: true
    })
    return
  }
  try {
    const {data} = await  axios.post(`http://localhost:4000/api/usuarios/olvide-password`, {email})

    setAlerta({
      msg: data.msg,
      error: false
    })
    
  } catch (error) {
    setAlerta({
      msg: error.response.data.msg,
      error: true
    })
  }
}
~~~
----
- Paso el controlador por aqui:
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
----
- Notar que poner msg siempre facilita las cosas a la hora de reutilizar la Alerta
- Es en el try controlador desde dónde voya enviar el email
- Copio y pego el mail en helpers y le cambio el nombre por emailOlvidePassword.
- Lo exporto y lo importo en el controlador

~~~js
 export const emailOlvidePassword = async(datos)=>{
      const {email, nombre, token} = datos;
  
      const transport = nodemailer.createTransport({
          host: process.env.HOST_SMTP,
          port: process.env.PORT_SMTP,
          auth: {
            user: process.env.USER_SMTP,
            pass: process.env.PASS_SMTP
          }
        });
  
        //información del email
  
        const info = await transport.sendMail({
          from:"UpTask -  Administrador de Proyectos",
          to: email,
          subject: "UpTask - Reestablece tu password",
          text: "Reestablece tu password en UpTask",
          html:` <p>Hola, ${nombre}. Has solicitado resetear tu password</p>
          <p>Sigue el siguiente enlace para reestablecer tu password</p>
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
          <p>Si este mensaje no es para ti puedes eliminarlo </p>
          `
  
        })
      }    
  
  
~~~
-----
- Lo añado en el try y lleno el cuerpo con el usuario (que ya tengo disponible) y sus valores dentro de un objeto
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

        emailOlvidePassword({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })
        res.json({msg: "Hemos enviado un email con las instrucciones"})
        
    } catch (error) {
        console.log(error)
    }

}
~~~

# Añadiendo el token para resetear password
- Hay que leer el token, extraerlo y hacer un llamado a la base de datos para hacer match
- Voy al componente (y ruta) NuevoPassword.jsx
- Hago una serie de importaciones
~~~js
import {Link, useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Alerta from '../components/Alerta'
~~~
- Hago uso del useEffect, va a ejecutarse una sola vez por lo que le coloco el arreglod e dependencias vacío
- Extraigo el token con useParams, lo llamo así porque así lo puse en el enrutado 
- Es un get porque lo estoy consultando en la base de datos
~~~js
import {Link, useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {

  const {token} = useParams()

  useEffect(()=>{
    const comprobarToken= async()=>{
      try {
        const {data}=await axios(`http://localhost:4000/api/usuarios/olvide-password/${token}`)
        
        console.log(data)

      } catch (error) {
        console.log(error.response)
      }
    }
    comprobarToken()

  },[])



  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl">Recupera tu password y administra tus  
    <span className="text-slate-700"> Proyectos</span></h1>
    
    
    <form className="bg-white my-10 shadow rounded-lg p-10">
     
      <div className="my-5">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="password">Nuevo Password</label>
        
        <input 
         id="password"
         type="password" 
         placeholder="Escribe tu nuevo password" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
      </div>
     

      <input type="submit" 
      value="Guardar password"
      className="bg-sky-700 mb-5 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
    </form>

    <nav className="lg:flex lg:justify-between">
      <Link to="/" className="block text-slate-500 text-center my-5">¿Ya tienes cuenta? Inicia sesión</Link>
    </nav>
  </>
  )
}

export default NuevoPassword
~~~
---- 
- A estas alturas, en lapantalla de Nuevo Password el console.log(data) me devuelve "usuario existe" ( tengo el token en la URL )
- Paso los datos de usuarioController
~~~js
const comprobarToken = async(req, res)=>{
    const {token} = req.params
    const tokenValido = await Usuario.findOne({token})

    if(tokenValido){
        res.json({msg:"El usuario existe"})
    }else{
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})
    }
}

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
----
- Creo un nuevo estado con tokenValido ( borro lo de la data, era para el console.log)
- Será apara mostrar el formulario en el caso de que el token sea válido o no
- También creo el state de Alerta, extraigo el msg y lo muestro de manera condicional
~~~jsx
import {Link, useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {

  const {token} = useParams()
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta,setAlerta] = useState({})

  useEffect(()=>{
    const comprobarToken= async()=>{
      try {
         await axios(`http://localhost:4000/api/usuarios/olvide-password/${token}`)
        
        setTokenValido(true)

      } catch (error) {
        
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()

  },[])

const {msg} = alerta

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl">Recupera tu password y administra tus  
    <span className="text-slate-700"> Proyectos</span></h1>
    
    {msg && <Alerta alerta={alerta} />}

    {tokenValido &&(

    <form className="bg-white my-10 shadow rounded-lg p-10">
     
      <div className="my-5">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="password">Nuevo Password</label>
        
        <input 
         id="password"
         type="password" 
         placeholder="Escribe tu nuevo password" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
      </div>
     

      <input type="submit" 
      value="Guardar password"
      className="bg-sky-700 mb-5 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
    </form>


    )}


    <nav className="lg:flex lg:justify-between">
      <Link to="/" className="block text-slate-500 text-center my-5">¿Ya tienes cuenta? Inicia sesión</Link>
    </nav>
  </>
  )
}

export default NuevoPassword
~~~
----
# Almacenando el nuevo Password
- Hay que validar el password. Creo un state para captar el input
- Tambien añado un onSubmit en el form con la función handleSubmit, le añado e.preventDefault( )
- Valido la extensión del password con password.length
~~~jsx
import {Link, useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {

  const {token} = useParams()

  const [password, setPassword]= useState('')
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta,setAlerta] = useState({})


  useEffect(()=>{
    const comprobarToken= async()=>{
      try {
         await axios(`http://localhost:4000/api/usuarios/olvide-password/${token}`)
        
        setTokenValido(true)

      } catch (error) {
        
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()

  },[])

  const handleSubmit = (e)=>{
    e.preventDefault()
    if(password.length <6){
      setAlerta({
        msg: "El password debe ser mínimo de 6 caracteres",
        error: true
      })
    }
  }

const {msg} = alerta

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl">Recupera tu password y administra tus  
    <span className="text-slate-700"> Proyectos</span></h1>
    
    {msg && <Alerta alerta={alerta} />}

    {tokenValido &&(

    <form className="bg-white my-10 shadow rounded-lg p-10" onSubmit={handleSubmit}>
     
      <div className="my-5">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="password">Nuevo Password</label>
        
        <input 
         id="password"
         type="password" 
         value={password}
         onChange={(e)=>setPassword(e.target.value)}
         placeholder="Escribe tu nuevo password" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
      </div>
     

      <input type="submit" 
      value="Guardar password"
      className="bg-sky-700 mb-5 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
    </form>


    )}


    <nav className="lg:flex lg:justify-between">
      <Link to="/" className="block text-slate-500 text-center my-5">¿Ya tienes cuenta? Inicia sesión</Link>
    </nav>
  </>
  )
}

export default NuevoPassword
~~~
----
- Para hacer la llamada a la base de datos tipo POST usaré un try catch, con await y axios
~~~jsx
  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(password.length <6){
      setAlerta({
        msg: "El password debe ser mínimo de 6 caracteres",
        error: true
      })
    }

    try {
      const url = `http://localhost:4000/api/usuarios/olvide-password/${token}`
      const {data} = await axios.post(url, {password})

      console.log(data)
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }
~~~
  ----
  - Mostraré una alerta para notificar que el password se ha modificado correctamente
~~~js
 const handleSubmit = async (e)=>{
    e.preventDefault()
    if(password.length <6){
      setAlerta({
        msg: "El password debe ser mínimo de 6 caracteres",
        error: true
      })
    }

    try {
      const url = `http://localhost:4000/api/usuarios/olvide-password/${token}`
      const {data} = await axios.post(url, {password})

      setAlerta({
        msg: data.msg,
        error: false
      })
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }
  ~~~
  ----
  Muestro el link de forma condicional con el state passwordModificado
  ~~~js
  import {Link, useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {

  const {token} = useParams()

  const [password, setPassword]= useState('')
  const [passwordModificado, setPasswordModificado]= useState(false)
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta,setAlerta] = useState({})


  useEffect(()=>{
    const comprobarToken= async()=>{
      try {
         await axios(`http://localhost:4000/api/usuarios/olvide-password/${token}`)
        
        setTokenValido(true)
        setPasswordModificado(true)

      } catch (error) {
        
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()

  },[])

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(password.length <6){
      setAlerta({
        msg: "El password debe ser mínimo de 6 caracteres",
        error: true
      })
    }

    try {
      const url = `http://localhost:4000/api/usuarios/olvide-password/${token}`
      const {data} = await axios.post(url, {password})

      setAlerta({
        msg: data.msg,
        error: false
      })
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

const {msg} = alerta

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl">Recupera tu password y administra tus  
    <span className="text-slate-700"> Proyectos</span></h1>
    
    {msg && <Alerta alerta={alerta} />}

    {tokenValido &&(

    <form className="bg-white my-10 shadow rounded-lg p-10" onSubmit={handleSubmit}>
     
      <div className="my-5">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="password">Nuevo Password</label>
        
        <input 
         id="password"
         type="password" 
         value={password}
         onChange={(e)=>setPassword(e.target.value)}
         placeholder="Escribe tu nuevo password" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
      </div>
     

      <input type="submit" 
      value="Guardar password"
      className="bg-sky-700 mb-5 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
    </form>


    )}


{passwordModificado && 
       <Link to="/" className="block text-slate-500 text-center my-5">Iniciar sesión</Link>}
  </>
  )
}

export default NuevoPassword
~~~
----
## NOTA: puedes configurar axios para no escribir una url tan larga todo el rato (opcional)
- creo una carpeta config en /src con clienteAxios.js
~~~js
import axios from 'axios'

const clienteAxios = axios.create({
    baseUrl: "http://localhost:4000/api"
})

export default clienteAxios
~~~
----
# Validando la autenticación
- Hago unas importaciones en el Login.jsx
~~~jsx
import {Link} from 'react-router-dom'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Alerta from '../components/Alerta'
~~~
----
- Creo el state para el email, password y alerta. Asigno un handleSubmit al form
- Hago la validación y extraigo de la alerta con desestructuración el msg para mostrarla de forma condicional
~~~jsx
import {Link} from 'react-router-dom'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Alerta from '../components/Alerta'

const Login = () => {

  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [alerta, setAlerta]= useState({})

  const handleSubmit= async (e)=>{
    e.preventDefault()
    if([email, password].includes("")){
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true
      })
      return
    }

  }

  const {msg} = alerta
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Inicia sesión y administra tus  
      <span className="text-slate-700"> Proyectos</span></h1>
      
      {msg && <Alerta alerta={alerta} />}
      
      <form className="bg-white my-10 shadow rounded-lg p-10"
        onSubmit={handleSubmit}>
        <div className="my-5">
          
          <label className="uppercase text-gray-600 block font-bold"
          htmlFor="email">Email</label>
          
          <input 
           id="email"
           value={email}
           onChange={e=>setEmail(e.target.value)}
           type="email" 
           placeholder="Email de registro" 
           className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>
        </div>
        <div className="my-5">
          
          <label className="uppercase text-gray-600 block font-bold"
          htmlFor="password">Password</label>
          
          <input 
           id="password"
           value={password}
           onChange={e=>setPassword(e.target.value)}
           type="password" 
           placeholder="Tu password" 
           className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
        </div>

        <input type="submit" 
        value="Iniciar Sesión"
        className="bg-sky-700 mb-5 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
      </form>

      <nav className="lg:flex lg:justify-between">
      <Link to="/registrar" className="block text-slate-500 text-center my-5">¿No tienes cuenta? Registrate</Link>
      <Link to="/olvide-password" className="block text-slate-500 text-center my-5">¿Olvidaste tu password?</Link>
        

      </nav>
    </>
  )
}

export default Login

~~~
----
- Si pasa la validación pasa al try catch donde se hará la llamada a la base de datos

# Autenticando al usuario
- Una petición de tipo POST a usuarios/login
- Importo axios! Le paso los states cómo objeto, como segundo parametro  despues de la url a axios 
~~~js
 const handleSubmit= async (e)=>{
    e.preventDefault()
    if([email, password].includes("")){
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true
      })
      return
    }
    try {

      const {data} = await axios.post('http://localhost:4000/api/usuarios/login', {email, password})

      console.log(data)
    } catch (error) {
      console.log(error.response.data.msg)
    }

  }
~~~
- console.log(data) me devuelve el usuario con su id y toda la info
- Si el usuario no existe me aparece en consola el mensaje de que no existe
- Creo el setAlerta en el error
- Voy a almacenar el token del inicio de sesion en el localStorage

~~~js
import {Link} from 'react-router-dom'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Alerta from '../components/Alerta'
import axios from 'axios'

const Login = () => {

  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [alerta, setAlerta]= useState({})

  const handleSubmit= async (e)=>{
    e.preventDefault()
    if([email, password].includes("")){
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true
      })
      return
    }
    try {

      const {data} = await axios.post('http://localhost:4000/api/usuarios/login', {email, password})

      localStorage.setItem('token', data.token)
    } catch (error) {
      setAlerta({
       msg: error.response.data.msg,
       error: true
        
      })
    }

  }

  const {msg} = alerta
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Inicia sesión y administra tus  
      <span className="text-slate-700"> Proyectos</span></h1>
      
      {msg && <Alerta alerta={alerta} />}
      
      <form className="bg-white my-10 shadow rounded-lg p-10"
        onSubmit={handleSubmit}>
        <div className="my-5">
          
          <label className="uppercase text-gray-600 block font-bold"
          htmlFor="email">Email</label>
          
          <input 
           id="email"
           value={email}
           onChange={e=>setEmail(e.target.value)}
           type="email" 
           placeholder="Email de registro" 
           className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>
        </div>
        <div className="my-5">
          
          <label className="uppercase text-gray-600 block font-bold"
          htmlFor="password">Password</label>
          
          <input 
           id="password"
           value={password}
           onChange={e=>setPassword(e.target.value)}
           type="password" 
           placeholder="Tu password" 
           className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
        </div>

        <input type="submit" 
        value="Iniciar Sesión"
        className="bg-sky-700 mb-5 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
      </form>

      <nav className="lg:flex lg:justify-between">
      <Link to="/registrar" className="block text-slate-500 text-center my-5">¿No tienes cuenta? Registrate</Link>
      <Link to="/olvide-password" className="block text-slate-500 text-center my-5">¿Olvidaste tu password?</Link>
        

      </nav>
    </>
  )
}

export default Login
~~~
---
- Lo próximo es CONTEXT 