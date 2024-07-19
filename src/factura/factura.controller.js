import { response, request } from 'express';
import Factura from './factura.model.js';
import Service from '../service/service.model.js'
import User from '../users/user.model.js'
import Product from '../product/product.model.js'
import Store from '../store/store.model.js'

export const newFactura = async (req, res) => {
    try {
        const { store, user, date, payment, total } = req.body;

        const saveFactura = new Factura({
            store,
            user,
            date,
            payment,
            total
        });

        const savedFactura = await saveFactura.save();

        return res.status(201).json(savedFactura);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const listFacturaId = async (req, res) => {
    const { id } = req.params;

    try {
        const factura = await Factura.findById(id)
            .populate('store', 'name direction')
            .populate('user', 'email nit');

        if (!factura) {
            return res.status(404).json({ error: 'Factura not found' });
        }

        const services = await Service.find({ factura: id })
            .populate('product', 'name price');

        const productList = services.map(service => ({
            productName: service.product.name,
            quantity: service.lot,
            price: service.product.price,
            subtotal: service.lot * service.product.price
        }));

        const totalSum = productList.reduce((sum, product) => sum + product.subtotal, 0);

        const response = {
            storeName: factura.store.name,
            storeDirection: factura.store.direction,
            userEmail: factura.user.email,
            userNit: factura.user.nit,
            products: productList,
            total: totalSum,
            date: factura.date
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const listFacturaStore = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const facturas = await Factura.find({ store: id })
            .populate('store', 'name')
            .populate('user', 'email');

        const response = facturas.map(factura => ({
            storeName: factura.store.name,
            userEmail: factura.user.email,
            date: factura.date
        }));

        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const listFacturaUser = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const facturas = await Factura.find({ user: id })
            .populate('store', 'name')
            .populate('user', 'email');

        const response = facturas.map(factura => ({
            storeName: factura.store.name,
            userEmail: factura.user.email,
            date: factura.date
        }));

        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const cancel = async (req, res) => {
    try {
        const { id } = req.params;

        const cancelFactura = Factura.findByIdAndDelete(id);
        const deleteServices = Service.deleteMany({ factura: id });
        await Promise.all([cancelFactura, deleteServices]);

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const factura = async (req, res) => {
    try {

        const finishFactura = await Factura.findByIdAndUpdate(id, {
            progress: false
        }, { new: true });

        if (!finishFactura) {
            return res.status(404).send('Factura not found');
        }

        return res.status(200).json(finishFactura);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};