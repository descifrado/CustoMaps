
const { playlist }= require('../dbModels/playlist');

async function createWatchLaterPlaylist(user){
    try{
        let nplay = new playlist({
            playlistName : "Watch Later",
            authorID : user._id,
            privacy : "Private",
            videoCount : 0
        });
        await nplay.save();
        return ;
    }
    catch(err){
        console.log("error occured at creating watch later playlist.");
        console.log(err);
        return ;
    }

}

module.exports = { createWatchLaterPlaylist : createWatchLaterPlaylist };