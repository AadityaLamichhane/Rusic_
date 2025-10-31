import { StorageController } from "../Storage"
import { Stream } from "../../UserClass";
export const playnext = async (sectionname: string) => {
	const Tos_of_Queue: Stream[] = await StorageController.getQueue(sectionname)// Section name is the section id in the redis config so this make sencs
	console.log(`This is the top of the stack `, Tos_of_Queue);
	console.log(`The top of the stack is ${JSON.stringify(Tos_of_Queue[0])}`);
	return;
} 
