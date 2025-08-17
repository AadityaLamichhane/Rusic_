"use client"
import { onConnectionToSection } from "@/lib/onConnectionToSection";
import { useSocketContext } from "@repo/lib/socketContext";
import { LoadingSectionComponent } from "@/app/components/LoadingSectionComponent";
import { use, useEffect , useState } from "react"
import { Loader } from "@/app/components/Loader";
import QueueApp from "../../components/SectionInformation"
import { ExportType ,SectionPageProps } from "@/lib/types";
 let sectionInformation :ExportType={
    isOwner:false , 
    isSection:false
}
export default function Component({params}:SectionPageProps) {
    const [loadingforsection , setLoadingforSection ] = useState(true);
    const {socket,loading,error} = useSocketContext();
    const resolvedParams = use(params);
    const {id} = resolvedParams;
    useEffect(()=>{
         onConnectionToSection(id).then((data :any)=>{
          if(!data.isError){
            sectionInformation = {...data};
            setLoadingforSection(false);
          }
         });
    },[]);
    if(loading){
        return <>
               <Loader></Loader> 
        </>
    }
    return <>
      <div className="w-full h-full">
          <div>
          </div>
      </div>
               {(loadingforsection==false && socket && sectionInformation.isSection)?<>
              <QueueApp>
              </QueueApp>
               </>:<>
               Failed to make the connection
               </>}
              {loadingforsection==false && socket && !sectionInformation.isSection? <>

              <LoadingSectionComponent id={id} socket={socket} sectionInformation={sectionInformation}>
              </LoadingSectionComponent>

              </>:<>
               </>}

      </>
}
