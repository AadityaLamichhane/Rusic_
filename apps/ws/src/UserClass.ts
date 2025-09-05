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
    id:string;
    url:string ;
    upvotes: number ;
    createdBy :string ;
    section:string; 
    title:string ;
    channelTitle:string;
    videoId:string;
    constructor (id:string , url:string , upvotes:number,createdBy:string,section:string,title:string,channelTitle:string,videoId:string){
        this.id = id ;
        this.title = title ; 
        this.channelTitle = channelTitle; 
        this.videoId = videoId ; 
        this.url = url ; 
        this.upvotes = upvotes;
        this.createdBy = createdBy;
        this.section = section;
    }
}

// Initializing the queue as the empty (--initial before making the server)

export const Section_Id_To_QueueMap = new Map<string,Stream[]>(); 
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