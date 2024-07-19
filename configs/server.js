'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import apiLimiter from '../src/middlewares/validar-cant-peticiones.js'

import authRoutes from '../src/auth/auth.routes.js'
import settingsRoutes from '../src/settings/settings.routes.js'
import storeRoutes from '../src/store/store.routes.js'
import productRoutes from '../src/product/product.routes.js'
import facturaRoutes from '../src/factura/factura.routes.js'
import serviceRoutes from '../src/service/service.routes.js'

import User from "../src/users/user.model.js";
import Factura from '../src/factura/factura.model.js'
import Product from '../src/product/product.model.js'
import Service from '../src/service/service.model.js'
import Store from '../src/store/store.model.js'

import { dbConnection } from './mongo.js'

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.authPath = '/zolve/v1/auth'
        this.settingsPath = '/zolve/v1/settings'
        this.storePath = '/zolve/v1/store'
        this.productPath = '/zolve/v1/product'
        this.facturaPath = '/zolve/v1/factura'
        this.servicePath = '/zolve/v1/service'

        this.middlewares()
        this.conectarDB()
        this.routes()
    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(helmet())
        this.app.use(morgan('dev'))
        this.app.use(apiLimiter)
    }

    routes() {
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.settingsPath, settingsRoutes);
        this.app.use(this.storePath, storeRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.facturaPath, facturaRoutes);
        this.app.use(this.servicePath, serviceRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port)
        })
    }
}

export default Server