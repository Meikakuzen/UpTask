import {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import Alerta from '../components/Alerta'

const ConfirmarCuenta = () => {

  const params = useParams()
  
  const {id} = params

  const [alerta,setAlerta] = useState({})

  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

  useEffect(()=>{

    const confirmarCuenta= async()=>{
      try {
        const url=`http://localhost:4000/api/usuarios/confirmar/${id}`
        const {data}= await axios(url)

        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)
        
      } catch (error) {
       
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
        
      }
    }
    confirmarCuenta()
  }, [])

  const {msg} = alerta

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl">Confirma tu cuenta y crea tus  
    <span className="text-slate-700"> Proyectos</span></h1>

    <div>
      {msg && <Alerta alerta={alerta} />}

      {cuentaConfirmada && 
       <Link to="/" className="block text-slate-500 text-center my-5">Iniciar sesión</Link>}
    </div>
  </>
  )
}

export default ConfirmarCuenta