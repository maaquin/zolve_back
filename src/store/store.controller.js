import Store from './store.model.js'
import User from "../users/user.model.js";
import Product from '../product/product.model.js'
import bcryptjs from "bcryptjs";

export const newStore = async (req, res) => {
    try {
        const { name, phone, direction, user, imgUrl, coordenadas } = req.body;

        const saveStore = new Store({
            name,
            phone,
            direction,
            user,
            imgUrl,
            coordenadas
        });

        const savedStore = await saveStore.save();

        return res.status(201).json(savedStore);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const listStores = async (req, res) => {
    try {
        const stores = await Store.find({ estado: true });
        return res.status(200).json(stores);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const listUserStores = async (req, res) => {
    try {
        const { user } = req.body;

        const stores = await Store.find({ user: user });
        return res.status(200).json(stores);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const listStoreId = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).send('Store not found');
        }
        return res.status(200).json(store);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const updateStore = async (req, res) => {
    try {
        const { id, name, direction, phone, avatarUrl, imgUrl, coordenadas } = req.body;

        const refreshStore = await Store.findByIdAndUpdate(id, {
            name,
            direction,
            phone,
            avatarUrl,
            imgUrl,
            coordenadas
        }, { new: true });

        if (!refreshStore) {
            return res.status(404).send('Store not found');
        }

        return res.status(200).json(refreshStore);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const deleteStore = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

            const deletedStore = await Store.findByIdAndUpdate(
                id,
                { estado: false },
                { new: true }
            );

            if (!deletedStore) {
                return res.status(404).send('Store not found');
            }

            const updateProducts = Product.updateMany(
                { store: id },
                { estado: false }
            );

            await Promise.all(updateProducts);

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

export const restoreStore = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

            const restoredStore = await Store.findByIdAndUpdate(
                id,
                { estado: true },
                { new: true }
            );

            if (!restoredStore) {
                return res.status(404).send('Store not found');
            }

            const updateProducts = Product.updateMany(
                { store: id },
                { estado: true }
            );

            await Promise.all(updateProducts);

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