import { UserType } from "../../models/UserModel"

export interface UserRepositoryInterface {
    findOne(filter:any):any
    DeleteOne(filter:any):any
    UpdateOne(filter:any,update:any):any
    create(user:UserType):any
    addToken(id:string,name:string,token:string):any   
    updateToken(id:string,name:string,token:string):any   
    deleteToken(idToken:string,idUser:string):any
}