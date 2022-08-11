import { Response,Request } from 'express';
import UserService from '../services/UserService';
import validateEmail from '../helper/validateEmail';
import RabbitService from '../services/RabbitService';
import { UserType } from '../models/UserModel';
import { Code } from 'mongodb';
class UserController {
    UserService: UserService;

    constructor() {
        this.UserService = new UserService();
        
    }

    async activeAccount(req:Request,res:Response) {
        
        try{
            const { _id,code } = req.body;
            let result = await this.UserService.activeUser(_id,code);
            let status,msg
            if( result ) {
                status = 200
                msg = 'Ok'
            }
            if(result == 'NotFound') {
                status = 404
                msg = 'Not Found'    
            } else if(result == 'InvalidCode') {
                status = 500
                msg = 'Sai Code'
            }

            return res.json({
                status: status,
                msg: msg
            })

        } catch (error) {
            res.status(500).json({
                status: 500,
                msg: error
            })
        }
    }
    async sigup(req: Request, res: Response) {
        // RabbitService.sendMessage(JSON.stringify({mail:'nghindps16371@fpt.edu.vn',content:'<h1>Nghi</h1>'}))
        try {
            let result
            let findUser = await this.UserService.checkUserName(req.body.username)
            if(!findUser) {
                let user = await this.UserService.registerAccount(req.body)
                if (user) { 
                    // const {code,...users} = user
                    // console.log(users);
                    
                    result = {
                        id: user._id,
                        username: user.name
                    }
                }
            } else {    
                result = 'username đã tồn tại'
            }
            
            return res.json({
                status: '200',
                msg: result
            })  
            
        } catch (error) {
            console.log(error);
           return res.json(error)
        }
        
        
    }
    
    async sigin(req: Request, res: Response) {
        try {
            let status, msg;
            const {username, password, deviceName} = req.body;
            let result = await this.UserService.sigin(req.body);
            if(result.status == false) {
                // return res.status(401).json("unauthorized")
                status = 401;
                msg = 'unauthorized';
            } else {
                let token = await this.UserService.generateToken(result.data)
                await this.UserService.UpdateRefreshToken(result.data._id,deviceName ,token.refreshToken);
                status = 200;
                msg = 'Ok'
                res.clearCookie('token');
                res.clearCookie("refresh_token");
                res.cookie('token',token.accessToken.toString(),{maxAge: 1000*60*30,httpOnly: true})
                res.cookie('refresh_token',token.refreshToken.toString(),{maxAge: 1000*60*60*24*30,httpOnly: true});
            }

            return res.json({
                status,
                msg
            })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
           
    }

    async changePassword(req:Request,res:Response) {
        try {
            const {username,password,newpass} = req.body
            // let user = await this.UserService.checkUserName(username);
            let status,msg
            let check = await this.UserService.sigin({username,password});
            
            if(check.status && password != newpass) {
                let user = await this.UserService.changepass(username,newpass);
                status = 200;
                msg = 'Ok';
                
            } else {
                status = 401;
                msg = 'Error'
            }

            res.json({status,msg})
        } catch (error) {
            console.log(error);
            
            res.send(error)
        }
    }
}

export default new UserController()