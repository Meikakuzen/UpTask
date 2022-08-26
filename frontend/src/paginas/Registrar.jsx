import { useState } from 'react'
import {Link} from 'react-router-dom'
import Alerta from '../components/Alerta'
import axios from 'axios'



const Registrar = () => {

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword]= useState('')
  const [password2, setPassword2]= useState('')
  const [alerta, setAlerta]= useState({})

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