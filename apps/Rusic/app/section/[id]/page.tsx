"use client"
import { onConnectionToSection } from "@/lib/onConnectionToSection";
import { useParams } from "next/navigation"
import { use, useEffect , useState } from "react"

export type SectionPageProps = {
    params: Promise<{
        id:string
    }>;
}
export default function Component({params}:SectionPageProps) {
    const [loading , setLoading ] = useState(true);
    const resolvedParams = use(params);
    const {id} = resolvedParams;
    useEffect(()=>{
         onConnectionToSection(id).then(()=>{
            console.log("Connnection to the section is Procedded as expected ");
            setLoading(false);
         });
    });
    if(loading){
        return <>
                <div className="bg-black w-screen h-screen flex justify-center items-center">

                    <div className=" flex justify-center items-center text-white">
                        The Content is loading 

                    </div>

                </div>
        </>
    }

    return <>
        {id}

    </>
}