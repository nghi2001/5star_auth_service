import { Response,Request } from 'express';
import UserService from '../services/UserService';

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

    async getNewToken (req:Request,res:Response) {
        try {
            let {refresh_token, user_id} = req.body;
            let checkExitsToken = await this.UserService.checkExitsToken(user_id, refresh_token);
            
            if( checkExitsToken && checkExitsToken.status == true ){
                console.log(checkExitsToken);
                
                let token = await this.UserService.generateAccessToken(checkExitsToken.data);
                
                return res.json(token);
            } else throw Error('Error')
        } catch (error) {
            console.log(error);
            res.status(401).json(error)
        }
    }
    async sigup(req: Request, res: Response) {
        try {
            let result
            let findUser = await this.UserService.checkUserName(req.body.username)
            if(!findUser) {
                let user = await this.UserService.registerAccount(req.body)
                if (user) { 
                    
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
                status = 401;
                msg = 'unauthorized';
            } else {
                let token = await this.UserService.generateToken(result.data)
                await this.UserService.UpdateRefreshToken(result.data._id,deviceName ,token.refreshToken);
                status = 200;
                msg = 'Ok'
                res.clearCookie('token');
                res.clearCookie("refresh_token");
                res.cookie('token',token.accessToken.toString(),{maxAge: 1000*60*60*24*30*30,httpOnly: true})
                res.cookie('refresh_token',token.refreshToken.toString(),{maxAge: 1000*60*60*24*30,httpOnly: true});
            }

            return res.json({
                status,
                msg: {
                    id: result.data._id,
                    name: result.data.name
                }
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

    async getListToken (req:Request, res:Response) {
        console.log(req.params.id);
        
        try {
            if( !req.params.id) {throw Error('thieu id')}
            let listToken = await this.UserService.getListToken(req.params.id);
            console.log(listToken);
            
            res.json(listToken)
        } catch (error) {
            res.json(error)
        }
    }

    async revokeToken(req:Request,res:Response) {
        try {
            const {idToken,idUser} = req.body;
            const result = await this.UserService.revokeToken(idUser, idToken)
            
            res.json(result)
        } catch (error) {
            console.log(error);
            res.json(error)            
        }
    }
}

export default new UserController()