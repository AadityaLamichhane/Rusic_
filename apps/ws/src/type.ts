 export enum Socket_Sending_type{
    Stream_Man, 
    Join_Section,
    Create_Stream,
    Initial_Call,
    Create_Section
 }
 
 export type Socket_Sending= {
   payload:{
      type:"req"| "res",
      commands:"addQueue"|"updateQueue"|""
      videoInfo?:{}
   },
    type : Socket_Sending_type,
    url?: string  ,
    token?: string,
    sectionid?: string
    msg?:String
    userid?:string
 }
