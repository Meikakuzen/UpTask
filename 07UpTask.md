# FRONTEND
- En la carpeta donde se encuentra el backend creo qel proyecto de react con nombre fromtend
> npm create vite@latest
- Instalo dos dependencias:
> npm i axios react-router-dom
- Voy a tener dos terminales, una para el backend ejecutándose y otra para el frontend
- Hago limpieza de los archivos que no necesito en react y limpio App.jsx ( dejo el index.css pero borro el contenido )

# Instalar Tailwind
> npm i -D tailwindcss postcss autoprefixer 
- Creo el archivo de configuración
> npx tailwindcss init -p

- En el archivo tailwind.config.cjs
~~~js
module.exports = {
  content: ["index.html", "src/**/*.jsx"],
  theme: {
    extend: {},
  },
  plugins: [],
}
~~~
- En index.css incluyo las directivas de tailwind
~~~css
@tailwind base;
@tailwind components;
@tailwind utilities;
~~~
- Le añado un color al body en el html
~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UpTask</title>
  </head>
  <body class="bg-gray-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
~~~
-----
# Creando ROUTING con React Router Dom 6
- Importo BrowserRouter, Routes y Route de react-router-dom en App.jsx
- Voy a tenr dos áreas, una pública donde registrar, recuperar el password o iniciar sesión, y una privada de manegement de los proyectos
- Creo las carpetas en /src layouts, paginas, components
- En layouts creo AuthLayout.jsx
- En App.jsx incorporo el layout que englobe las rutas
~~~jsx
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'


function App() {
  

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout/>} >

          </Route>

        </Routes>
      </BrowserRouter>
  )
}

export default App
~~~
-------

- Creo el Login.jsx en /src/paginas y lo añado como index ( es decir, la página que muestra en "/" ) al BrowserRouter
- No se visualiza el Login porque hay que definir el Outlet en el componente de Layout.jsx
~~~jsx
import {Outlet} from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
      <div>AuthLayout</div>
    
    
      <Outlet />

    </>

    
  )
}

export default AuthLayout
~~~
-------
- Ahora ya está inyectando el contenido y visualizo Login
- Creo otra ruta llamada registrar con su componente en paginas
- Creo dos páginas más: OlvidePassword y NuevoPassword
~~~jsx
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import Login from './paginas/Login'
import NuevoPassword from './paginas/NuevoPassword'
import OlvidePassword from './paginas/OlvidePassword'
import Registrar from './paginas/Registrar'


function App() {
  

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout/>} >
            <Route index element={<Login />} />
            <Route path="registrar" element={<Registrar />} />
            <Route path="olvide-password" element={<OlvidePassword/>} />
            <Route path="olvide-password/:token" element={<NuevoPassword />} />

          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
~~~
------
- En olvidé password el usuario va a colocar su email y se le enviará el token via email con el enlace, se leerá el token de la url y se hará la validación
- Creo otra página, ConfirmarCuenta.jsx
~~~jsx
   <Route path="confirmar/:id" element={<ConfirmarCuenta />} />
~~~

- Una vez que le envie el email para confirmar la cuenta presiona el boton, leo el id de la url y se hace la validación
# Creando el Layout principal para el área pública

- Coloco un main con el outlet, centro el contenido con mx-auto y añado unmediaquery. Tambien un display flex en tamaño mediano, y lo centro
- Añado un div con un mediaquery de tamaño mediano que tome 2 terceras partes y en uno más grande 2 partes de 5 ( el 40%)
- Coloco el Outlet dentro
- AuthLayout.jsx
~~~jsx
import {Outlet} from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
      
    
      <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
        <div className="md:w-2/3 lg:w-2/5">
          <Outlet />
        </div>
      </main>
      

    </>

    
  )
}

export default AuthLayout
~~~
------
- De esta manera aplica a todos los hijos de AuthLayout
# Creando formulario Login

- Añado los estilos. Le pongo un htmlFor para comunicar con el id el label y el input, así cuando clico en el label resalta el input
~~~jsx
import React from 'react'

const Login = () => {
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Inicia sesión y administra tus  
      <span className="text-slate-700"> Proyectos</span></h1>
      
      
      <form className="bg-white my-10 shadow rounded-lg px-10 py-5">
        <div className="my-5">
          
          <label className="uppercase text-gray-600 block font-bold"
          htmlFor="email">Email</label>
          
          <input 
           id="email"
           type="email" 
           placeholder="Email de registro" 
           className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>
        </div>
      </form>
    </>
  )
}

export default Login
~~~
-----
- Copio este div para el password.
- Añado el input de tipo submit antes de cerrar el form
~~~jsx
 <input type="submit" 
        value="Iniciar Sesión"
       className="bg-sky-700 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
~~~
----
- Queda así el componente ( con algunos retoques de margins):
~~~jsx
import React from 'react'

const Login = () => {
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Inicia sesión y administra tus  
      <span className="text-slate-700"> Proyectos</span></h1>
      
      
      <form className="bg-white my-10 shadow rounded-lg p-10">
        <div className="my-5">
          
          <label className="uppercase text-gray-600 block font-bold"
          htmlFor="email">Email</label>
          
          <input 
           id="email"
           type="email" 
           placeholder="Email de registro" 
           className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>
        </div>
        <div className="my-5">
          
          <label className="uppercase text-gray-600 block font-bold"
          htmlFor="password">Password</label>
          
          <input 
           id="password"
           type="password" 
           placeholder="Tu password" 
           className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
        </div>

        <input type="submit" 
        value="Iniciar Sesión"
        className="bg-sky-700 mb-5 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
      </form>
    </>
  )
}

export default Login
~~~
----
# Añadiendo el Routing

- Añado un nav despues del form ( dentro del div ) en Login.jsx
~~~jsx
  <nav className="lg:flex lg:justify-between">
      <Link to="/registrar" className="block text-slate-500 text-center my-5">¿No tienes cuenta? Registrate</Link>
      <Link to="/olvide-password" className="block text-slate-500 text-center my-5">¿Olvidaste tu password?</Link>
        

      </nav>
~~~
# Registrar

- Copio todo lo que hay en el fragment y lo incorporo en Registrar.jsx
- Le añado un campo con el nombre y otro con repetir password

# Nuevo Password

- Copio el fragment de registrar y dejo solo el campo del password. Cambio el titulo, el input y el routing
- Copio el fragment de NuevoPassword y lo copio en Confirmar cuenta. Dejo solo el titulo y lo cambio por confirma tu cuenta
  - No hay routing a otras páginas
  - No hay formulario
  - Desde aqui se confirmará la cuenta
# 411 Añadiendo state al formulario 
- Borro todo lo que hay en la base de datos
- Creo el state para los 4 campos de Registrar.jsx. Lo hago por separado ( un state para cada campo )
# Validación
- En el onSubmit del form añado una nueva función llamada handleSubmit
- Pongo todos los states en un arreglo y verifico que no haya ningún espacio en blanco con .includes
- Creo un nuevo componente llamado Alerta para mostrarlo en caso de que hayan campos vacíos
~~~js

const Alerta = ({alerta}) => {
  return (
    <div className={`${alerta.error ? 'from-red-400 to-red-600': 'from-sky-400 to-sky-600'} bg-gradient-to-br 
    text-center p-3 rounded-xl text-white font-bold text-sm my-10 uppercase`}>
        {alerta.msg}
    </div>
  )
}

export default Alerta
~~~
- Creo un nuevo state para manejar la alerta, con un objeto vacío ya que tiene un objeto con error y otro con mensaje
- Extraigo el mensaje de la alerta. En caso de que no esté vacío muestro la alerta 
~~~jsx
import { useState } from 'react'
import {Link} from 'react-router-dom'
import Alerta from '../components/Alerta'



const Registrar = () => {

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword]= useState('')
  const [password2, setPassword2]= useState('')
  const [alerta, setAlerta]= useState({})
const handleSubmit= (e)=>{
  e.preventDefault()

  if([nombre,email,password,password2].includes('')){
    
    setAlerta({
      msg: "Todos los campos son obligatorios",
      error: true
    })
    return
  }
}

const {msg} = alerta;

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl">Crea tu cuenta y administra tus  
    <span className="text-slate-700"> Proyectos</span></h1>
    
    {msg && <Alerta alerta={alerta}/>}
    
    <form className="bg-white my-10 shadow rounded-lg p-10"
      onSubmit={handleSubmit}>
      <div className="my-5">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="nombre">Nombre</label>
        
        <input 
         id="nombre"
         type="text" 
         value={nombre}
         onChange={e=>setNombre(e.target.value)}
         placeholder="Tu nombre" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>
      </div>
      <div className="my-5">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="email">Email</label>
        
        <input 
         id="email"
         type="email"
         value={email} 
         onChange={e=>setEmail(e.target.value)}
         placeholder="Email de registro" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50"/>
      </div>
      <div className="my-5">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="password">Password</label>
        
        <input 
         id="password"
         type="password"
         value={password} 
         onChange={e=> setPassword(e.target.value)}
         placeholder="Tu password" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
      </div>
      <div className="my-5">
        
        <label className="uppercase text-gray-600 block font-bold"
        htmlFor="repetir-password">Repite tu password</label>
        
        <input 
         id="password2"
         type="password" 
         value={password2}
         onChange={e=>setPassword2(e.target.value)}
         placeholder="Repite tu password" 
         className="w-full mt-3 p-2 border rounded-xl bg-gray-50 mb-3"/>
      </div>

      <input type="submit" 
      value="Registrate"
      className="bg-sky-700 mb-5 text-white w-full font-bold p-2 rounded-xl uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
    </form>

    <nav className="lg:flex lg:justify-between">
    <Link to="/" className="block text-slate-500 text-center my-5">¿Ya tienes cuenta? Inicia sesión</Link>
    <Link to="/olvide-password" className="block text-slate-500 text-center my-5">¿Olvidaste tu password?</Link>
      

    </nav>
  </>
  )
}

export default Registrar
~~~
---
- Ahora falta validar que los dos passwords sean iguales
# Validando password y password2

- Primero verifico que matchean
- Tambien verifico que sea más largo de 6 caracteres
~~~js
const handleSubmit= (e)=>{
  e.preventDefault()

  if([nombre,email,password,password2].includes('')){
    
    setAlerta({
      msg: "Todos los campos son obligatorios",
      error: true
    })
    return
  }
  if(password !== password2){
    setAlerta({
      msg: "Los passwords no coinciden",
      error: true
    })
    return
  }
  if(password.length < 6){
    setAlerta({
      msg: "El password es muy corto, mínimo 6 caracteres",
      error: true
    })
    return
  }
  setAlerta({})
  console.log("creando registro...")
}

~~~
- Ahora que ya valida, lo próximo es llamar a la API
----
# Enviando request a la API
- Usaré un try catch en lugar de ese console.log de creando registro
- Lo mismo que incluia en POSTMAN en el body lo haré ahora con código.
- Para ello usaré axios
~~~jsx
  const handleSubmit= async (e)=>{
  e.preventDefault()

  if([nombre,email,password,password2].includes('')){
    
    setAlerta({
      msg: "Todos los campos son obligatorios",
      error: true
    })
    return
  }
  if(password !== password2){
    setAlerta({
      msg: "Los passwords no coinciden",
      error: true
    })
    return
  }
  if(password.length < 6){
    setAlerta({
      msg: "El password es muy corto, mínimo 6 caracteres",
      error: true
    })
    return
  }
  setAlerta({})

  try {
    const respuesta = await axios.post('http://localhost:4000/api/usuarios',{
      nombre,
      email,
      password
    })
    
    console.log(respuesta)
  } catch (error) {
    console.log(error)
  }
}
~~~
- Esto solo no funciona, por un problema de CORS ya los dos están en localhost

# Habilitar peticiones por CORS
- Se configura en el backend ( en el index )
- Instalo el paquete cors en la carpeta raíz del backend
> npm i cors
- Importo el paquete en el index.js
- Creo una lista blanca, compruebo si en origins esta la dirección de la lista blanca ( mi localhost del frontend)
  - Si esta, le doy acceso con el callback en true, el primer parámetro null( de error )
  - Si no esta ( else ) le niego el acceso y mando un error
- tengo que añadirle los headers
- Este es el código en el index
~~~js
const whitelist = ["http://127.0.0.1:5173"];

const corsOptions ={
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error("Error de cors"))
        }
    }
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
~~~
----
- Puedo desestructurar la data de la petición axios, que es lo que interesa
- Si voy al backend, al usuarioController, ahí tenia el res.json(usuarioAlmacenado) en la funcion registrar
~~~js
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
        res.json({usuarioAlmacenado})


    } catch (error) {
        console.log(error)
    }


}
~~~
----
- Registrar.jsx (frontend)
~~~jsx

  const handleSubmit= async (e)=>{
  e.preventDefault()

  if([nombre,email,password,password2].includes('')){
    
    setAlerta({
      msg: "Todos los campos son obligatorios",
      error: true
    })
    return
  }
  if(password !== password2){
    setAlerta({
      msg: "Los passwords no coinciden",
      error: true
    })
    return
  }
  if(password.length < 6){
    setAlerta({
      msg: "El password es muy corto, mínimo 6 caracteres",
      error: true
    })
    return
  }
  setAlerta({})

  try {
    const {data} = await axios.post('http://localhost:4000/api/usuarios',{
      nombre,
      email,
      password
    })
    console.log(data) //esto me devuelve solo lo que necesito, los datos del usuario
    
    
  } catch (error) {
    console.log(error)
  }
}
~~~
----
- En el archivo usuarioController del backend, en la función registrar, en el try, cuando sale bien, en lugar de devolver usuarioAlmacenado, devolveré un mensaje
~~~jsx
const registrar = async (req,res)=>{

    const {email} = req.body
    const existeUsuario =  await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error('Usuario ya registrado, revisa tu mail');
        return res.status(400).json({msg:error.message})
    }
    
    try {
        const usuario = new Usuario(req.body)
        usuario.token= generarId()
        
        const usuarioAlmacenado= await usuario.save()
        res.json({msg:"Usuario creado corectamente!"})


    } catch (error) {
        console.log(error)
    }


}
~~~
----
- Para acceder al mensaje del servidor y mostrarlo en pantalla uso el setAlerta
- Para mostrar el error del servidor si intento registrar un correo existente, caigo en el catch
- Para mostrar la info de este mensaje es usa error.response ( documentación de axios )
  - Ahi tengo data, la cual puedo mostrar en el setAlerta con el msg (así lo nombré en el controlador del backend)
~~~jsx
const handleSubmit= async (e)=>{
  e.preventDefault()

  if([nombre,email,password,password2].includes('')){
    
    setAlerta({
      msg: "Todos los campos son obligatorios",
      error: true
    })
    return
  }
  if(password !== password2){
    setAlerta({
      msg: "Los passwords no coinciden",
      error: true
    })
    return
  }
  if(password.length < 6){
    setAlerta({
      msg: "El password es muy corto, mínimo 6 caracteres",
      error: true
    })
    return
  }
  setAlerta({})

  try {
    const {data} = await axios.post('http://localhost:4000/api/usuarios',{
      nombre,
      email,
      password
    })
    
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
- Las rutas deben de estar ocultas en variables de entorno
# Instalando y configurando NodeMailer