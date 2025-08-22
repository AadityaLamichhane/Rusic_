
export class User {
    name :string ;
    socket:WebSocket | undefined;
    id:string
    constructor (name:string,id:string,socket?:WebSocket){
        this.name = name;
        this.socket = socket ;
        this.id = id ; 
    }
}
export class Stream {
    url:string ;
    upvotes: number ;
    createdBy :string ;
    constructor (url:string , upvotes:number,createdBy:string){
        this.url = url ; 
        this.upvotes = upvotes;
        this.createdBy = createdBy;
    }
}
export class Queue{
    stream:Stream[]=[];

}
export const sectionMap = new Map<string,User[]>();
export const userSectionMap = new Map<string,string>();
export const  createUser  = (name:string,id:string,socket?:WebSocket)=>{
    if(socket!=undefined){
        const tempUser = new User(name,id);
        return tempUser ; 
    }else{
        const tempUser = new User(name,id,socket);
        return tempUser ;
    }
}