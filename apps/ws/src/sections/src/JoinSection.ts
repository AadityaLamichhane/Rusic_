import { sectionMap,User } from "../../UserClass";
import {SectionIdList} from "../.."
import prisma from "@repo/db/client";
export async function Join_the_section (sectionid:string,user:User,socket:WebSocket){
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

    }else{
        
        const usersarray = sectionMap.get(sectionid);
        if(usersarray!=undefined){
            // know if the user is already if this user 
            const isGivenUser = sectionMap.get(sectionid)?.filter((individualUser:User)=>individualUser.id==user.id);
            if(!isGivenUser){
                sectionMap.set(sectionid ,[...usersarray,user]);
            }
        }else{
            console.log("unexpected behaviour");
            return false ; 
        }
    } 
           return true ;  
    }