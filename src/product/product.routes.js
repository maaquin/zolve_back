import { Router } from "express";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

import { 
    newProduct, 
    listProducts, 
    listBadProduct, 
    listProductId, 
    updateProduct, 
    deleteProduct, 
    restoreProduct, 
    listProductStore
} from "./product.controller.js";

const router = Router()

router.post("/", [validarJWT, validarCampos ], newProduct);
router.get("/", listProducts);
router.get("/bad/:id", listBadProduct);
router.get("/:id", listProductId);
router.put("/update", [validarJWT], updateProduct);
router.put("/delete", [validarJWT], deleteProduct);
router.put("/restore", [validarJWT], restoreProduct);
router.get("/store/:id", listProductStore);

export default router;