import bcrypt from 'bcrypt';
import { UserType } from '../models/UserModel';
import UserModel from '../models/UserModel';
import jwt, {Secret} from 'jsonwebtoken';
import UserRepository from '../repository/UserRepository';
class UserService {
    hello() {
        return 'ajnvjlanvl';
    }

    async checkUserName(name:string) {
        let user = await UserRepository.findOne({username: name});
        return user
    }

    async activeUser(name:string) {
        let user = await UserRepository.UpdateOne({username:name}, {has_access : true})
    }

    async registerAccount(user:UserType): Promise<UserType> {
        let salt = await bcrypt.genSalt();
        let hashpass = await bcrypt.hash(user.password, salt);
        user.password = hashpass
        let newUser = await UserRepository.create(user)
        
        // setTimeout(async () => {
        //     let User = await this.checkUserName(newUser.username);
        //     if(User?.has_access == false) {
        //         UserRepository.DeleteOne({_id: newUser._id});
        //     } else {

        //     }
            
        // },10000)
        return newUser          
    }

    async sigin(user: UserType) {
        let result = await UserRepository.findOne({username: user.username});
        if( result != null ){
            if(bcrypt.compareSync(user.password, result.password)) {
                return {status:true, data: result};
            }
        }
        return {status:false}        
    }


    async generateToken(user:any) {
        let {_id,username} = user
        //create Access Token
        const accessToken = jwt.sign({_id,username},process.env.ACCESS_TOKEN_SECRET as Secret,{
            expiresIn: '10m'
        })
        console.log(process.env.ACCESS_TOKEN_SECRET);
        console.log(1,accessToken);
        
        //create Refresh Token

        const refreshToken = jwt.sign({_id, username}, process.env.REFRESH_TOKEN_SECRET as Secret, {
            expiresIn : '1h'
        })

        return {
            accessToken,
            refreshToken
        }
    }
}

export default new UserService()