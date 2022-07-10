import { Response,Request } from 'express';
import jwt from 'jsonwebtoken';
import UserService from '../services/UserService';
import validateEmail from '../helper/validateEmail';
import RabbitService from '../services/RabbitService';
class UserController {

    constructor() {
    }
    async sigup(req: Request, res: Response) {

        if( req.body.username == '' ||
            req.body.username == null || 
            req.body.password == null ||
            req.body.password == '')
            {
            res.status(400)
            res.json("missign params")
        }
        let user = await UserService.checkUserName(req.body.username)
        if(user != null) {
            res.status(400).json("user already exists")
        } else {

            if(validateEmail(String(req.body.username))) {
                let newUser = await UserService.registerAccount(req.body)
                console.log(newUser);
                
                res.status(200).json(newUser);

            } else {
                res.status(400)
                res.json("email not valid")
            }
        }
    }

    async sigin(req: Request, res: Response) {
        if( req.body.username == '' ||
            req.body.username == null || 
            req.body.password == null ||
            req.body.password == '')
            {
            res.status(400)
            res.json("missign params")
        }
        let result = await UserService.sigin(req.body);
        if(result.status == false) {
            res.status(401).json("unauthorized")
        } else {
            let token = await UserService.generateToken(result.data)
            res.cookie('rememberme', '1', { maxAge: 900000 });
              res.send('kdkd')
        }
        
    }
}

export default new UserController()