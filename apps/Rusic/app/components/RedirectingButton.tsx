"use client"
import { useSocketContext } from "@repo/lib/socketContext";
import { ReactNode } from "react";

export const  RedirectingButton = ({children}:{children:React.ReactNode})=>{
    const socket = useSocketContext();
    return <>
        <button onClick={async()=>{

            // call an action to join in the db and then redirect it to theuser 

        }} className="border rounded-md p-2 hover:bg-black hover:text-white cursor-pointer">
            {children}
        </button>
        
    </>
}