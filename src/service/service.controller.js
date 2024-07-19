import { response, request } from 'express';
import Service from './service.model.js';

export const newService = async (req, res) => {
    try {
        const { factura, product, lot } = req.body;

        const saveService = new Service({
            factura,
            product,
            lot
        });

        const savedService = await saveService.save();

        return res.status(201).json(savedService);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const listServiceFactura = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const service = await Service.find({ estado: true, factura: id });
        res.status(200).json(service);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({ message: 'service not found' });
        }

        res.status(200).json({ message: 'Service delete succesly' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Somthing went wrong' });
    }
};