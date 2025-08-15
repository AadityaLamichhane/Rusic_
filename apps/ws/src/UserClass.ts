export class User {
    name :string ;
    socket:WebSocket | undefined;
    constructor (name:string,socket:WebSocket){
        this.name = name;
        this.socket = socket || undefined;
    
    }
}
export const sectionMap = new Map<string,User[]>();