/*
should able to handle the authentication error while connecting to the socket and then return the socket 
*/
import {  useEffect, useState  } from "react";
import { onSocketConnection } from "@repo/lib";
import { useSession } from "next-auth/react";
export  function useSocketContext(){
    const user = useSession();
    const [socket , setSocket ] = useState<WebSocket|null>(null);
    const [loading , setLoading ] = useState(true);
    const [error , setError ] = useState(false);
    const [token  , setToken ] = useState('');
    const [errorsyntax ,setErrorSyntax] = useState('');
    
    useEffect(()=>{
        if(!token && user.status=='authenticated'){
            onSocketConnection().then((object:string)=>{
                setToken(object);
            });
        }
        if(user.status=='authenticated' && token!==''){
            if(!socket){
                const socketFile = new WebSocket("ws://localhost:8080");
                setSocket(socketFile);
                if(!socketFile){
                    setError(true);
                    setErrorSyntax("Socket Connection failed");
                }
                setLoading(false);
            }
            if(!user.data?.user){
                setError(true);
                setErrorSyntax("No user exist onn the session");
            }
        }
    },[user,token]);
    
    if(error){
        // handle the error properly 
        console.log(errorsyntax);
    }
    
    console.log({socket,loading,error,token});
    return {socket , loading , error , token };
}


