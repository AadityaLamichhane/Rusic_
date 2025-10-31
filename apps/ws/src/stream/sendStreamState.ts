import { StorageController } from "./../redis/Storage";
const StreamStateController = {
	//This will not have the exact time of the stream but will have the function that can calculate one 
	get_current_time: async () => {
		// Hit the redis api with the input 
		const current_playing_id = StorageController.getcurrentPlaying;





	}


}
export default StreamStateController; 
