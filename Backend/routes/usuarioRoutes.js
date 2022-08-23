import express from 'express'
import {autenticar, confirmar, olvidePassword, registrar, comprobarToken, nuevoPassword, perfil} from '../controllers/usuarioController.js'
import Usuario from '../models/Usuario.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()



router.post("/", registrar) //crea un nuevo usuario
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword )
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)
router.get('/perfil', checkAuth, perfil)

export default router