import { StorageController } from "../../../redis/Storage"

export const current_playing_stream = async (sectionname: string) => {
	const item = await StorageController.getcurrentPlaying(sectionname);
    return item ; 

}
