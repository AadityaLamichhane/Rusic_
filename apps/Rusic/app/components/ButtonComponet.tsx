"use client"
import axios from "axios";
import { useRef } from "react";
export const ButtonComponent = ({setContextGiver , contextgiver}:{setContextGiver:any, contextgiver:any})=>{
   const inpvalue = useRef<HTMLInputElement>(undefined); 
   console.log(contextgiver);
   console.log('re-render');
    return <>
    {/* @ts-ignore */}
        <input  ref={inpvalue} placeholder='Enter the url of the Link' className="border p-2  " type="text" />
        <button className="bg-blue-400 p-2 m-2 text-white rounded-3xl px-4" onClick={async ()=>{
            const reqData = {
                url : inpvalue.current?.value
            }
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
            };              
            const data = await axios.post('http://localhost:3000/api/stream',reqData,config);
           setContextGiver('hardcodefornow'); 
           
            

        }}>Stream</button>
    </>

}