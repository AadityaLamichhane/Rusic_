"use client"
import { onConnectionToSection } from "@/lib/onConnectionToSection";
import { useSocketContext } from "@repo/lib/socketContext";
import { LoadingSectionComponent } from "@/app/components/LoadingSectionComponent";
import { use, useEffect , useState } from "react"
import { Loader } from "@/app/components/Loader";
import QueueApp from "../../components/SectionInformation"
import { ExportType ,SectionPageProps } from "@/lib/types";
import { Provider } from "react-redux";
import { store } from "@/app/components/store/store";
 let sectionInformation :ExportType={
    isOwner:false , 
    isSection:false,
  
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
         return ()=>{
          socket?.close();
        }
    },[]);
    if(loading){
        return <>
        <div className="flex flex-col w-screen h-screen justify-center items-center">
          <div className="flex justify-center items-center">
            <div>
               <Loader></Loader> 
            </div>
          </div>
        </div>
        </>
    }
    return <>
      <div className="w-full h-full">
          <div>
          </div>
      </div>
               {(loadingforsection==false && socket && sectionInformation.isSection)?<>
               <Provider store={store}>
                <QueueApp userSocket={socket} id={id} userid={sectionInformation.userid  as string} isOwner={sectionInformation.isOwner}>
                </QueueApp>
               </Provider>
               </>:<>
               </>}
              {loadingforsection==false && socket && !sectionInformation.isSection? <>
                <LoadingSectionComponent id={id} socket={socket} sectionInformation={sectionInformation} >
                </LoadingSectionComponent>
              </>:<>
               </>}

      </>
}
