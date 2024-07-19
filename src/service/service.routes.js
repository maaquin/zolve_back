import { Router } from "express";

import { 
    newService, 
    listServiceFactura, 
    deleteService
} from "./service.controller.js";

const router = Router()

router.post("/", newService);
router.get("/:id", listServiceFactura);
router.delete("/:id", deleteService);

export default router;