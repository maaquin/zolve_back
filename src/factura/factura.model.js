import mongoose, { Schema } from "mongoose";

const facturaSchema = mongoose.Schema({
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date:{
        type: Date,
    },
    payment:{
        type: String,
        enum: ["cash", "credit card"]
    },
    total:{
        type: Number,
    },
    progress:{
        type: Boolean,
        default: true
    }
})

export default mongoose.model('Factura', facturaSchema)