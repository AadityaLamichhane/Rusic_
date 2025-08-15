"use client"
import axios from "axios";
import { useRef, useState } from "react";
export const ButtonComponent = ({setContextGiver , contextgiver}:{setContextGiver:any, contextgiver:any})=>{
   const inpvalue = useRef<HTMLInputElement>(undefined); 
   const videoData = useRef<Object>(null);
   const [thumbnail , setThumbnail ] = useState('');
console.log(thumbnail);
   if(videoData!=null){
   }
   
    return <>
    {/* @ts-ignore */}
    <div className='flex flex-col relative w-full h-full '>
        {(videoData.current!=null) && thumbnail!=''?<>
        {/* //@ts-ignore */}
         <div className="aspect-video bg-gray-200 overflow-hidden w-[640px] h-[360px]" style={{
         }}>
                    <img 
                      src={thumbnail?thumbnail:""} 
                      alt={"Image"}
                      className=" object-fit"
                    />
                  </div>
        </>:<></>}
        {/* @ts-ignore */}
        <input  ref={inpvalue} placeholder='Enter the url of the Link' className="border p-2  " type="text" />
        <button className="bg-blue-400 p-2 m-2 text-white rounded-3xl px-4 cursor-pointer" onClick={async(e)=>
        {
            //@ts-ignore
            e.target.style.scale = 0 
            const reqData = {
                url : inpvalue.current?.value
            }
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
            };        
            try{
            const data = await axios.post('http://localhost:3000/api/stream',reqData,config);
            setThumbnail(data.data.videoinfo.thumbnail.thumbnails[4].url as string);
            videoData.current = data.data.videoinfo

            }catch(err){
                console.log('you are seeing the errrowwhile getting')
            }
            // @ts-ignore
                e.target.style.scale= 1

        }}>Stream</button>
    </div>
    </>

}
