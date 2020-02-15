//here retrieve the videoId and stringify this is for liking the video

changeLikeButtons = function (likes,dislikes,a, b) {
    if (a == 1) {
        $("#like").css('background', 'green');
        $("#like").html(likes + '<i class="fa fa-thumbs-up" aria-hidden="true"></i> You liked this')
    }
    if (a == 0) {
        $("#like").css('background', '#111');
        $("#like").html(likes + ' Like')
    }

    if (b == 1) {
        $("#dislike").css('background', 'red');
        $("#dislike").html(dislikes  +' <i class="fa fa-thumbs-down" aria-hidden="true"></i> You disliked this')
    }
    if (b == 0) {
        $("#dislike").css('background', '#111');
        $("#dislike").html(dislikes + ' Dislike')
    }
}

$("#like").click(function () {


    var videoid = window.currentPlayVideoId;
    console.log(window.currentPlayVideoId);
    $.post("/video/likeVideo",
        {
            //here the id of video id required which is currently running
            _id: videoid,
        },
        function (data, status) {
            if (data.code == 1)
                changeLikeButtons(data.likes, data.dislikes, 1, 0);
            else if (data.code == -1)
                changeLikeButtons(data.likes, data.dislikes, 0, 0);
            else
                changeLikeButtons(data.likes, data, dislikes, 1, 0);
            console.log(status);
        });
});

$("#dislike").click(function () {

    var videoid = window.currentPlayVideoId;
    $.post("/video/dislikeVideo",
        {
            //here the id of video id required which is currently running
            _id: videoid,
        },
        function (data, status) {
            if (data.code == 1)
                changeLikeButtons(data.likes, data.dislikes, 0, 1);
            else if (data.code == -1)
                changeLikeButtons(data.likes, data.dislikes, 0, 0);
            else
                changeLikeButtons(data.likes, data.dislikes, 0, 1);
        });
});


//adding comment on video
$("#add_comment").click(function () {
    videoid = window.currentPlayVideoId;

    $.post("/video/addComment",
        {
            //here the id of video id required which is currently running
            videoId: videoid,
            content: document.getElementById("comment_video").value,
        },
        function (data, status) {
            if (data == 1) {
                alert("you added a comment on video");
                content: document.getElementById("comment_video").value;
              //  $("#dummy").before('<li class="media" style="position: relative"> <a class="pull-left" > <img class="media-object img-circle" src="/static/images/user.png" alt="profile" </a> <div class="media-body"> <div class="well well-lg"> <h4 class="media-heading text-uppercase reviews"> </h4> <ul class="media-date text-uppercase reviews list-inline"></ul><p class="media-comment" id="" data-_id=""> ' +  content + '</p></div></div></li>')
                document.getElementById("comment_video").value = '';
            }
            else if (data == -1)
                alert("your comment was not added");
        });
});


//DELETE comment on video
$("#remove_comment").click(function () {
    $.post("video/removeComment",
        {
            commentId: "5d752dbdf3677340885ff1e0",
        },
        function (data, status) {
            if (data == 1) {
                alert("you deleted a comment on video");
            }
            else if (data == -1)
                alert("comment could not be deleted");
        });
});


//this is to set the default value of save edit changes to disable clicking property.. 
//document.getElementById("save_comment").disabled = true;

//this is to disable the  edit comment textarea
//document.getElementById("comment_video").disabled = true;


//this is to handle the request to edit the comment
$("#edit_comment").click(function () {
    $.post("video/editComment",
        {
            commentId: "5d752d18a3efe94b60821b02",
        },
        function (data, status) {
            if (data == 1) {
                alert("you can edit the comment");
                document.getElementById("comment_video").disabled = false;
                document.getElementById("save_comment").disabled = false;
                document.getElementById("edit_comment").disabled = true;
            }
            else if (data == -1) {
                alert("you cannot edit the comment");
            }
        });
});



//this is to save what all you have changed in comment
$("#save_comment").click(function () {
    $.post("video/saveComment",
        {
            commentId: "5d752d18a3efe94b608221b0",
            content: document.getElementById("comment_video").value,
        },
        function (data, status) {
            if (data == 1) {
                alert("you have edited the comment succesfully");
                document.getElementById("comment_video").disabled = true;
                document.getElementById("save_comment").disabled = true;
                document.getElementById("edit_comment").disabled = false;
            }
            else if (data == -1) {
                alert("you were unable to edit the comment");
            }
        });
});

//this will by default set the save_video inactive
//document.getElementById("save_video").disabled = true;

//this is not editable name of video initially
//document.getElementById("video_name").disabled = true;
//document.getElementById("video_description").disabled = true;


//this is to handle the request to edit the video name and description
$("#edit_video").click(function () {
    $.post("video/editVideo",
        {
            videoId: "5d752d18a3efe94b608221b0",
        },
        function (data, status) {
            if (data == 1) {
                alert("you can edit the video name and description");
                document.getElementById("save_video").disabled = false;
                document.getElementById("video_name").disabled = false;
                document.getElementById("video_description").disabled = false;
                document.getElementById("edit_video").disable = true;
            }
            else if (data == -1) {
                alert("you cannot edit the comment");
            }
        });
});


//this is to change the video name and description
$("#save_comment").click(function () {
    $.post("video/saveVideo",
        {
            videoId: "5d752d18a3efe94b608221b0",
            videoName: document.getElementById("video_name").value,
            videoDescription: document.getElementById("video_description"),
        },
        function (data, status) {
            if (data == 1) {
                alert("you have edited the video succesfully");
                document.getElementById("video_name").disabled = true;
                document.getElementById("video_description").disabled = true;
                document.getElementById("save_video").disabled = true;
                document.getElementById("edit_video").disabled = false;

            }
            else if (data == -1) {
                alert("you were unable to edit the comment");
            }
        });
});





