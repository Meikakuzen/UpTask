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