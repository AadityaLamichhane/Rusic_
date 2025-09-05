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
    section:string; 
    constructor (url:string , upvotes:number,createdBy:string,section:string){
        this.url = url ; 
        this.upvotes = upvotes;
        this.createdBy = createdBy;
        this.section = section;
    }
}
export class Queue{
    stream:Stream[]=[];
};
// Initializing the queue as the empty (--initial before making the server)
export const streamQueue:Queue ={stream:[]}; 
export const Section_Id_To_QueueMap = new Map<string,Queue>(); 
export const sectionMap = new Map<string,User[]>();
export const  createUser  = (name:string,id:string,socket?:WebSocket)=>{
    if(socket!=undefined){
        const tempUser = new User(name,id);
        return tempUser ; 
    }else{
        const tempUser = new User(name,id,socket);
        return tempUser ;
    }
}