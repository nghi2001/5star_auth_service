import * as mongoose from 'mongoose';
const { Schema } = mongoose

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
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
    has_access?: Boolean
}
export default mongoose.model('User', UserSchema);