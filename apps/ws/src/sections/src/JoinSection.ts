import {  sectionMap,User } from "../../UserClass";
import {SectionIdList} from "../.."
import {  sub } from "../../redisconfig";
import prisma from "@repo/db/client";
import { Section_Subhandler } from "../../redis/SectionSubHandler";
export async function Join_the_section (sectionid:string,socket:WebSocket){
    //@ts-ignore
    const user:User = socket.user ; 

   
    if(!sectionMap.get(sectionid) && !SectionIdList.includes(sectionid)){
        sectionMap.set(sectionid ,[user]);
        try{
        const sectionCreation = await prisma.section.create({
            data:{ 
                createrId:user.id,
                Sectionname:sectionid
            }
        });
        // Set the SectionIdList

        if(sectionCreation==undefined || sectionCreation==null){
            return false ; 
        }
        }catch(err){
            console.log('Error while joining the section');
            console.log(err);
            }
            console.log('The storage is initialize');
            sub.subscribe(sectionid,async (messege:string)=>{
                Section_Subhandler(messege);
            })
            
    }else{
       SectionIdList.push(sectionid);
        const usersarray = sectionMap.get(sectionid);
        if(usersarray!=undefined ){
//          In this Using the get will cause the error as the array will be there causing the illusion that it is defined and store in the variable while it is not 
            const alreadyInSection = usersarray.some((u:User)=> u.id===user.id);
            if(!alreadyInSection){
                sectionMap.set(sectionid,[...usersarray,user]);
            }
        }else{
            console.log("unexpected behaviour");
            return false ; 
        }
    } 
           return true ;  
    }