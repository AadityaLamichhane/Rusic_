"use client"
import { onConnectionToSection } from "@/lib/onConnectionToSection";
import { useSocketContext } from "@repo/lib/socketContext";
import { useParams } from "next/navigation"
import { handleClientScriptLoad } from "next/script";
import { use, useEffect , useState } from "react"
import { Socket_Sending } from "@repo/lib/socketContext";
import { Socket_Sending_type } from "@repo/lib/socketContext";
export type SectionPageProps = {
    params: Promise<{
        id:string
    }>;
}
type ExportType = {
    isOwner:boolean  ,
    isError?:boolean,
    AnyError? :String,
    createdBy?:String
    isSection:boolean
}
let sectionInformation :ExportType={
    isOwner:false , 
    isSection:false
}

let socketSendingVariable :Socket_Sending  = {
  type:Socket_Sending_type.Initial_Call
};


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
            // 
         });
    },[]);
    if(loading){
        return <>
               <Loader></Loader> 
        </>
    }
if(error){
    return <>
    <Error></Error>
    </>
}

if(loadingforsection){
    return <>
      <div className="bg-red-700 w-screen h-screen flex justify-center items-center">
                    <div className=" flex justify-center items-center text-white">
                        <div className="flex ">
                          Loading for the section
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
            {loadingforsection==false && socket? <>
            <LoadingSectionComponent id={id} socket={socket}>
            </LoadingSectionComponent>

            </>:<></>}
      
    </>
}
const LoadingSectionComponent = ({id,socket}:{id:string,socket:WebSocket|null})=>{
    const handleCreateSection =()=> {
      socketSendingVariable.type = Socket_Sending_type.Join_Section;
      socketSendingVariable.sectionId = id;
      socket?.send(JSON.stringify(socketSendingVariable));
      if(socket){
        // @ts-ignore
      }

    }
    return <>
     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          
          {/* No Section Found Text */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-800">
              No Section Found
            </h1>
            <p className="text-gray-600 text-lg">
              It looks like there are no sections with ID:{id}. Get started by creating your first section.
            </p>
          </div>

          {/* Create Section Button */}
          <button
            onClick={handleCreateSection}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            Create Section
          </button>
        </div>
      </div>
    </div>
</>
    
}
const Loader = ()=>{
    return (<>
   <div className="bg-black w-screen h-screen flex justify-center items-center">
                    <div className=" flex justify-center items-center text-white">
                        <div className="flex ">
                           Joining the socket Channel
                        </div>
                    </div>
                </div>
    </>)
}
const Error = ()=>{
    return (<>
    <Error></Error>
    </>)
}