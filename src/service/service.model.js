import mongoose, { Schema } from "mongoose";

const serviceSchema = mongoose.Schema({
    factura: {
        type: Schema.Types.ObjectId,
        ref: 'Factura',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    lot: {
        type: Number,
    }
})

export default mongoose.model('Service', serviceSchema)