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
    duration:number; 
    id:string;
    url:string ;
    upvotes: number ;
    createdBy :string ;
    section_name:string; 
    title:string ;
    channelTitle:string;
    videoId:string;
    constructor (id:string , url:string , upvotes:number,createdBy:string,section_name:string,title:string,channelTitle:string,videoId:string,duration:number){
        this.id = id ;
        this.duration = duration ;
        this.title = title ; 
        this.channelTitle = channelTitle; 
        this.videoId = videoId ; 
        this.url = url ; 
        this.upvotes = upvotes;
        this.createdBy = createdBy;
        this.section_name =section_name;
    }
}

// Initializing the queue as the empty (--initial before making the server)

export const Section_Id_To_QueueMap = new Map<string,Stream[]>([]); 
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