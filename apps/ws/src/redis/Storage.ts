import { StorageClass } from "./SectionStorage";
import { pub } from "../redisconfig";
export let StorageController :StorageClass;
export const StorageInit  = ()=>{
    console.log('The Storage is made');
    StorageController = new StorageClass(pub);
}
