import {  useEffect, useState  } from "react";
import { onSocketConnection } from "@repo/lib";
import { useSession } from "next-auth/react";
import { parse } from "path";
 export enum Socket_Sending_type{
    Stream_Man, 
    Join_Section,
    Create_Stream,
    Initial_Call
 }
 export type Socket_Sending= {
    type : Socket_Sending_type,
    url?: string  ,
    token?: string,
    sectionId?: string,
    msg?:string
 }
let Soket_SendingVariable: Socket_Sending ={
    type: Socket_Sending_type.Initial_Call,
    token: "",
    msg:''
} 
export  function useSocketContext(){
    const user = useSession();
    const [socket , setSocket ] = useState<WebSocket|null>(null);
    const [loading , setLoading ] = useState(true);
    const [error , setError ] = useState(false);
    const [token  , setToken ] = useState('');
    const [errorsyntax ,setErrorSyntax] = useState('');
  
    function afterToken(){
            if(user.status=='authenticated' && token!==''){
                try{
                    const socketFile = new WebSocket("ws://localhost:8080");
                    Soket_SendingVariable={
                        ...Soket_SendingVariable,
                        token:token
                    }
               socketFile.addEventListener("open",()=>{
                socketFile.send(JSON.stringify(Soket_SendingVariable));
               })
               socketFile.onerror = ()=>{
                setError(true)
                setErrorSyntax("Error in the socket file");
                return ; 
               }
               socketFile.onclose = ()=>{
                socket?.close();
                setError(true)
                setErrorSyntax("Disconnected from the socket connection")
               }
                socketFile.addEventListener("message",(messegeEvent)=>{
                    const parsedMessege = JSON.parse(messegeEvent.data);
                    if(parsedMessege.type==Socket_Sending_type.Initial_Call && !parsedMessege.token){
                        if(parsedMessege.msg=="success"){
                            setLoading(false);
                        }else{
                            console.log("Not authenticed ");
                            // error handling 
                            setError(true);
                            setErrorSyntax("you are not authenticated ");
                            setLoading(false);
                            return ;
                        }
                        }
                })
                setSocket(socketFile);
                }catch(error:any){
                        setError(true)
                        setErrorSyntax(error.name)
                }
        }
        return ;
    }
useEffect(()=>{
    if(token == '' && user.status=='authenticated'){
        onSocketConnection().then((object:string)=>{
        setToken(object);
        setLoading(true);
        });
    }
    return ()=>socket?.close()
},[user.status]);
    useEffect(()=>{
        if(token!=''){
        afterToken();
        }
    },[token]);
    return {socket , loading , error , token ,errorsyntax}
}
