"use client"
import { onConnectionToSection } from "@/lib/onConnectionToSection";
import { useSocketContext } from "@repo/lib/socketContext";
import { useParams } from "next/navigation"
import { use, useEffect , useState } from "react"

export type SectionPageProps = {
    params: Promise<{
        id:string
    }>;
}
export default function Component({params}:SectionPageProps) {
    const [loadingforsection , setLoadingforSection ] = useState(true);
    const {socket,loading,error} = useSocketContext();
    const resolvedParams = use(params);
    const {id} = resolvedParams;
    useEffect(()=>{
         onConnectionToSection(id).then((data)=>{
            console.log("Connnection to the section is Procedded as expected ");
            setLoadingforSection(false);
            // Send the request to the Db to join the section
            // 
         });
    },[]);
    if(loading){
        return <>
                <div className="bg-black w-screen h-screen flex justify-center items-center">

                    <div className=" flex justify-center items-center text-white">
                        <div className="flex ">
                           Joining the socket Channel
                        </div>
                    </div>

                </div>
        </>
    }
if(error){
    return <>
    Failed While getting the information
    </>

}
    return <>
    <div className="w-full h-full">
        <div>

        </div>
    </div>
            {loadingforsection?<>
            Joining the room....
            </>:<><div>
                Room information
            </div>

            </>}
        {id}

    </>
}