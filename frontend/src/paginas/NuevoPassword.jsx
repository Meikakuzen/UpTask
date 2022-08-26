import {Link} from 'react-router-dom'

const NuevoPassword = () => {
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