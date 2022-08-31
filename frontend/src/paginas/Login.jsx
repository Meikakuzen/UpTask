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