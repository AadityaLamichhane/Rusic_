import { sectionMap, User } from "../../UserClass";
import { SectionIdList } from "../.."
import { sub } from "../../redisconfig";
import prisma from "@repo/db/client";
import { Section_Subhandler } from "../../redis/SectionSubHandler";
export async function Join_the_section(sectionid: string, socket: WebSocket) {
    //@ts-ignore
    const user: User = socket.user;

    // If section exists in map
    if (sectionMap.has(sectionid)) {
        const usersarray = sectionMap.get(sectionid);
        if (usersarray) {
            const alreadyInSection = usersarray.some((u: User) => u.id === user.id);
            if (!alreadyInSection) {
                sectionMap.set(sectionid, [...usersarray, user]);
            }
        }
    } else {
        // If section does not exist in map, check DB
        const sectionFromDb = await prisma.section.findUnique({
            where: { Sectionname: sectionid },
        });

        if (sectionFromDb) {
            // Section exists in DB, but not in map. Load it.
            sectionMap.set(sectionid, [user]);
            if (!SectionIdList.includes(sectionid)) {
                SectionIdList.push(sectionid);
                sub.subscribe(sectionid, async (messege: string) => {
                    Section_Subhandler(messege);
                });
            }
        } else {
            // Section does not exist in DB, create it.
            try {
                await prisma.section.create({
                    data: {
                        createrId: user.id,
                        Sectionname: sectionid
                    }
                });
                sectionMap.set(sectionid, [user]);
                SectionIdList.push(sectionid);
                sub.subscribe(sectionid, async (messege: string) => {
                    Section_Subhandler(messege);
                });
            } catch (err) {
                console.log('Error while creating the section');
                console.log(err);
                return false;
            }
        }
    }

    return true;
}
