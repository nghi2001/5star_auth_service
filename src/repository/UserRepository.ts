import UserModel, { UserType } from "../models/UserModel"


class UserRepository {
    async create(user:UserType):Promise<UserType> {

        let newUser = new UserModel()
        newUser.username = user.username;
        newUser.password = user.password;
        newUser = await newUser.save();
        return newUser
    }

    async findOne(filter:any) {
        
        let result = await UserModel.findOne(filter);
        return result
    }

    async DeleteOne(filter:any) {
        let result = await UserModel.deleteOne(filter);
        return result;
    }

    async UpdateOne(filter:any, prop:any) {
        
    }
}

export default new UserRepository()