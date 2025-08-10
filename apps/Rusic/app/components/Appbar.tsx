"use client";
import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
export const AppBar = ()=>{
    const session = useSession();
    const user = session.data?.user;
    return (<>
    <div className="flex items-center relative w-full h-full bg-slate-300 justify-between px-3  ">
        <div className="text-white font-bold text-2xl">
            Rusic
        </div>
        <div className="p-2 px-6 m-2 bg-blue-500 rounded-2xl cursor-pointer text-white  font-bold" onClick={()=>user?signOut():signIn()}>
        {session.data?.user ? < >Signout</>:<>Signin</>}
        </div>


    </div>
    </>)
    
}