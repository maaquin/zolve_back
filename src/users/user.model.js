import mongoose, { Schema } from 'mongoose'

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["CLIENT_ROLE", "ADMIN_ROLE"]
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
    },
    nit: {
        type: String,
        default: 'cf'
    },
    customerId:{
        type: String,
    },
    confirmationToken: {
      type: String,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
})

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
  }

export default mongoose.model('User', UserSchema)