import {Router} from "express";

import { validarCampos } from "../middlewares/validar-campos.js";

import { 
    getUserSetting, 
    usuariosPut,
    usuariosRole, 
    passwordPatch,
    getUserSettingSolo,
    checkout,
    newMetodPayment,
    listMethodPayment,
    deleteMetodPayment,
    generateClientToken
} from "./settingsUser.controller.js";

const router = Router()

router.post('/user', getUserSetting)
router.post('/solo', getUserSettingSolo)
router.put('/user', [validarCampos], usuariosPut)
router.put('/role', usuariosRole)
router.patch('/user', passwordPatch)
router.post('/newCard', newMetodPayment)
router.post('/checkout', checkout)
router.post('/cards', listMethodPayment)
router.delete('/deleteCard/:token', deleteMetodPayment)
router.get('/token', generateClientToken);

export default router