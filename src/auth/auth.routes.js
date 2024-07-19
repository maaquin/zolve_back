import { Router } from "express";

import { validarCampos } from "../middlewares/validar-campos.js";

import { 
    login, 
    register,
    confirmToken
} from "./auth.controller.js";

const router = Router()

router.post('/login', [validarCampos], login)
router.post('/register', [validarCampos], register)
router.get('/confirm/:token', confirmToken)

export default router;