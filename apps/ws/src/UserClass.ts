import { pub,sub } from "./redisconfig";
import {RedisClientType} from "redis"
export class User {
    name :string ;
    socket:WebSocket | undefined;
    id:string
    constructor (name:string,socket:WebSocket,id:string){
        this.name = name;
        this.socket = socket || undefined;
        this.id = id ; 
    }
}
export const sectionMap = new Map<string,User[]>();
export const userSectionMap = new Map<string,string>();
//                             userId ,sectionId 