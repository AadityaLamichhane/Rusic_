"use client"
import {  useState , useEffect, useRef } from "react"
import { useSession } from "next-auth/react";
import { ButtonComponent } from "../components/ButtonComponet";
import  { useSocketContext }  from "@repo/lib/socketContext";
import { useRouter } from "next/navigation";
export default function Stream (){
    const sessionInformation =  useSession();
    const inpvalue  = useRef<HTMLInputElement>(null);
    const [messege , setMessege ] = useState(['']);
    const navigate = useRouter();

    const {socket , loading , token ,error } = useSocketContext();
    if(socket!=null){
        socket.onopen=()=>{
            
        }
        socket.onmessage=((e)=>{
            console.log(JSON.stringify(e));
        })

    }
    useEffect(()=>{
        // Get the user id and send the Request to the Redis and connect the user to the ws connection
        // send the socket request to send the joining of the room
        
    },[loading]);
    if(loading){
        return <>
         <div className="flex w-screen h-screen justify-center items-center animate-pulse">
      <div className="flex flex-col space-y-4 w-full max-w-md px-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 rounded w-1/2 self-center"></div>

        {/* Input field skeleton */}
        <div className="h-10 bg-gray-300 rounded w-full"></div>

        {/* Buttons skeleton */}
        <div className="flex gap-4">
          <div className="h-10 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
        </>
    }
    return( <>
    <div className="flex flex-col h-full w-full">
    <div className="flex w-screen h-screen justify-center items-center  ">
        <div>
            <div className="flex flex-col justify-center items-center font-medium ">
            Enter the Stream url 
            <br></br>
            <input  ref={inpvalue} placeholder='Enter the url of the Link' className="border p-2  " type="text" />
            </div>
            <div className="flex ">
                <ButtonComponent inputValue={inpvalue.current?.value  as string}
                >
                </ButtonComponent>
                <button className="flex justify-center items-center bg-blue-400 px-4 p-2 m-2 rounded-3xl text-white " onClick={()=>{
                    console.log("Round trip to the Db ");
                navigate.push(`/localhost:3000/stream/${inpvalue}`)
                }} >
                    upvote 

                </button>
            </div>
        </div>
    </div>
        <div>
            
        </div>
        <div>

        </div>
    </div>
    </>)
} 