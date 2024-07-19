import { response, request } from "express";
import bcryptjs from "bcryptjs";
import Product from "./product.model.js";
import User from "../users/user.model.js";
import Store from '../store/store.model.js';

export const newProduct = async (req, res) => {
    try {
        const { name, description, store, lot, imgUrl, price } = req.body;

        const saveProduct = new Product({
            name,
            description,
            store,
            lot,
            imgUrl,
            price
        });

        const savedProduct = await saveProduct.save();

        return res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const listProducts = async (req, res) => {
    try {
        const products = await Product.find({ estado: true });
        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};


export const listBadProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ store: id, estado: false })
            .populate('store', 'name')
            .exec();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const listProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Store not found');
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id, name, description, store, lot, imgUrl, price } = req.body;

        const refreshProduct = await Product.findByIdAndUpdate(id, {
            name,
            description,
            store,
            lot,
            imgUrl,
            price
        }, { new: true });

        if (!refreshProduct) {
            return res.status(404).send('Product not found');
        }

        return res.status(200).json(refreshProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

            const deletedProduct = await Product.findByIdAndUpdate(
                id,
                { estado: false },
                { new: true }
            );

            if (!deletedProduct) {
                return res.status(404).send('Product not found');
            }

            return res.status(204).send();
        }
        if (!user) {
            return res
                .status(400)
                .send(`Wrong credentials, ${email} doesn't exists en database`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const restoreProduct = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

            const deletedProduct = await Product.findByIdAndUpdate(
                id,
                { estado: true },
                { new: true }
            );

            if (!deletedProduct) {
                return res.status(404).send('Product not found');
            }

            return res.status(204).send();
        }
        if (!user) {
            return res
                .status(400)
                .send(`Wrong credentials, ${email} doesn't exists en database`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const listProductStore = async (req, res) => {
    const { id } = req.params;

    try {
        const store = await Store.findById(id);

        if (!store) {
            return res.status(404).send('Store not found');
        }

        const product = await Product.find({ store: store._id, estado: true });
        const productWithStore = product.map(product => ({
            store: store.name,
            _id: product._id,
            name: product.name,
            dascription: product.dascription,
            store: product.store,
            lot: product.lot,
            imgUrl: product.imgUrl,
            price: product.price,
        }));

        return res.status(200).json({ total: productWithStore.length, products: productWithStore });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};