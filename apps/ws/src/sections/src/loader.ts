import { createUser } from "../../UserClass";
import prisma from "@repo/db/client"
import { userIdMapping } from "../..";
  export function loader(){
    prisma.user.findMany({}).then((cal:any[])=>{
        for(let i = 0 ; i <cal.length; i++){
        const induser  = (createUser(cal[i].name,cal[i].id));
            userIdMapping.set(cal[i].id,induser);
           
        }
    }).catch((err:Error)=>{
        console.log(err);
    });
}