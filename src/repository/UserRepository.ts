import UserModel, { UserType } from "../models/UserModel"
import {v4} from 'uuid'
import {UserRepositoryInterface} from './interface/UserInterface'

class UserRepository implements UserRepositoryInterface{
    constructor() {
    }
    async create(user:UserType):Promise<any> {

        let newUser = new UserModel()
        newUser.username = user.username;
        newUser.password = user.password;
        newUser.email = user.email;
        newUser.name = user.name;
        newUser.code = v4()
        let result = await newUser.save();
        
        return result
        
    }
    async addToken(id:string,name:string,token:string) {
        try {
            let User = await UserModel.findById(id);
            User?.refreshToken.push({name:name,token:token});
            await User?.save()
            return true
        } catch (error) {
            return error
        }
    }
    async findOne(filter:any) {
        
        let result = await UserModel.findOne(filter);
        return result
    }
    
    async DeleteOne(filter:any) {
        let result = await UserModel.deleteOne(filter);
        return result;
    }

    async UpdateOne(filter:any, update:any) {
        let result = await UserModel.findOneAndUpdate(filter,update)
    }
}

export default UserRepository