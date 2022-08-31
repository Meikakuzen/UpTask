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