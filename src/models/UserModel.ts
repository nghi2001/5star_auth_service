import * as mongoose from 'mongoose';
const { Schema } = mongoose

const TokenSchema = new Schema({
    name: {type: String},
    token: {type: String}
})
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
    ,
    code: {
        type: String
    },
    refreshToken: [
        TokenSchema
    ]
    ,
    has_access: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})
export type UserType = {
    _id?: mongoose.Types.ObjectId,
    username: string ,
    password: string,
    has_access?: Boolean,
    email: string,
    code?:string,
    name: string,
    refreshToken?: [any]
}
export default mongoose.model('User', UserSchema);