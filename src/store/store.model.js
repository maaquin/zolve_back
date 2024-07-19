import mongoose, { Schema } from "mongoose";

const storeSchema = mongoose.Schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    direction: {
        type: String,
    },
    user: {
        type: String,
    },
    imgUrl: {
        type: String,
    },
    coordenadas:{
        type: String,
    },
    estado:{
        type: Boolean,
        default: true
    }
})

export default mongoose.model('Store', storeSchema)