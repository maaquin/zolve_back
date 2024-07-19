import { Router } from "express";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

import { 
    newFactura, 
    listFacturaId, 
    listFacturaStore, 
    listFacturaUser, 
    factura
} from "./factura.controller.js";

const router = Router()

router.post("/", [validarJWT, validarCampos], newFactura);
router.get("/store/:id", listFacturaStore);
router.get("/user/:id", listFacturaUser);
router.get("/:id", listFacturaId);
router.put("/", [validarJWT, validarCampos], factura);

export default router;