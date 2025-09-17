import { StorageClass } from "./SectionStorage";
import { pub } from "../redisconfig";
export let StorageController :StorageClass;
export const StorageInit  = ()=>{

    StorageController = new StorageClass(pub);
    
}
