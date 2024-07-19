import User from '../users/user.model.js';
import bcryptjs from 'bcryptjs';
import braintree from 'braintree';

export const getUserSetting = async (req, res) => {
    try {
        const { userId } = req.body

        console.log(userId)

        const userData = await User.findById(userId)

        return res.status(200).json({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            store: userData.store,
            nit: userData.nit,
            creditCard: userData.creditCard
        })
    } catch (e) {
        return res.status(500).send('Something went wrong')
    }
}

export const getUserSettingSolo = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await User.find({ estado: true, _id: userId });
        res.status(200).json(user);
    } catch (e) {
        return res.status(500).send('Something went wrong')
    }
}

export const usuariosPut = async (req, res) => {
    const { userId, username, email, nit, creditCard } = req.body;

    const actualizaciones = { username: username, email: email, nit: nit, creditCard: creditCard };
    const usuarioActualizado = await User.findByIdAndUpdate(userId, actualizaciones, { new: true });

    console.log(usuarioActualizado)

    res.status(200).json({
        msg: 'Tu usuario ha sido actualizado'
    });
}

export const usuariosRole = async (req, res) => {
    const { userId, role } = req.body;

    const actualizaciones = { role: role };
    const usuarioActualizado = await User.findByIdAndUpdate(userId, actualizaciones, { new: true });

    console.log(usuarioActualizado)

    res.status(200).json({
        msg: 'Tu usuario ha sido actualizado',
        usuario_nuevo: usuarioActualizado.usuario
    });
}

export const passwordPatch = async (req, res) => {
    try {
        const { userId, password, newPassword } = req.body

        const userData = await User.findById(userId, { password: 1 })

        const isPasswordCorrect = await bcryptjs.compare(password, userData.password)

        if (!isPasswordCorrect) {
            return res.status(400).send('Invalid password. Please try again')
        }

        const encryptedPassword = await bcryptjs.hash(newPassword, 10)

        await User.updateOne({ _id: userId }, { password: encryptedPassword })

        return res.status(200).send('Password changed succesfully')
    } catch (e) {
        return res.status(500).send('Somthing went wrong')
    }
}

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'h9jcyvqkt6k3p24r',
    publicKey: 't4wnpvhq7mnk76pw',
    privateKey: '20b7bc7daa8b02235ea5ffca6101effb'
});

export const generateClientToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, (err, response) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send({ clientToken: response.clientToken });
        });
    } catch (e) {
        return res.status(500).send('Something went wrong')
    }
};

export const newMetodPayment = async (req, res) => {
    try {
        const { customerId, paymentMethodNonce, amount } = req.body;

        // Paso 1: Crear el método de pago
        gateway.paymentMethod.create({
            customerId: customerId,
            paymentMethodNonce: paymentMethodNonce,
            options: {
                verifyCard: true
            }
        }, async (err, paymentMethodResult) => {
            if (err) {
                return res.status(500).send({ error: 'Error creating payment method', details: err });
            }

            // Obtener el token del método de pago
            const paymentMethodToken = paymentMethodResult.paymentMethod.token;

            // Paso 2: Crear la transacción
            gateway.transaction.sale({
                amount: amount,
                paymentMethodToken: paymentMethodToken,
                options: {
                    submitForSettlement: true
                }
            }, (err, transactionResult) => {
                if (err) {
                    return res.status(500).send({ error: 'Error creating transaction', details: err });
                }
                res.send(transactionResult);
            });
        });
    } catch (e) {
        return res.status(500).send({ error: 'Something went wrong', details: e });
    }
};


export const listMethodPayment = async (req, res) => {
    try {
        const { userId } = req.body;

        const customerId = userId;

        gateway.customer.find(customerId, (err, customer) => {
            if (err) {
                if (err.type === 'notFoundError') {
                    return res.status(404).send({ error: 'Customer not found', details: err });
                }
                return res.status(500).send({ error: 'Error retrieving customer', details: err });
            }
            res.send(customer.paymentMethods);
        });
    } catch (e) {
        return res.status(500).send({ error: 'Something went wrong', details: e });
    }
};

export const deleteMetodPayment = async (req, res) => {
    try {
        const { token } = req.params;

        gateway.paymentMethod.delete(token, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.send(result);
        });
    } catch (e) {
        return res.status(500).send('Something went wrong')
    }
};

export const checkout = async (req, res) => {
    try {
        const { paymentMethodToken, amount } = req.body;

        gateway.transaction.sale({
            amount: amount,
            paymentMethodToken: paymentMethodToken,
            options: {
                submitForSettlement: true
            }
        }, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.send(result);
        });
    } catch (e) {
        return res.status(500).send('Something went wrong')
    }
};