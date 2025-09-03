import prisma from "@repo/db/client"
 export function Sections(){
    prisma.stream.deleteMany({}).then((responce:{count:string}|any)=>{
        console.log('count of the stream Deleted',responce);
        prisma.section.deleteMany({}).then((callback:any)=>{
            console.log(`Total of ${callback.count} is being deleted `);
        });
    })
}