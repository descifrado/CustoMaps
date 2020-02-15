function showStuff(element) {  // this is for tab switching in login and sign up page
  var tabContents = document.getElementsByClassName('tabContent');
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = 'none';
  }
  var toshow = document.getElementById(element.dataset.tab);
  toshow.style.display = 'block';
  $('.tabButton').removeClass("bg-white").removeClass("border-top-red-5");
  $('.tabButton').addClass("bg-darkgrey").addClass("font-light").addClass("border-top-1-5").addClass("border-bottom-1-5");
  element.classList.add('bg-white');
  element.classList.remove('font-light');
  element.classList.remove('border-top-1-5');
  element.classList.remove('border-bottom-1-5');
  element.classList.add('border-top-red-5');
}


function showMsgAddedToPlaylist() {
  $('div.addedToPlaylist').show(100);
  setTimeout(() => {
    $('div.addedToPlaylist').hide(100);
  }, 4000);
}
function showMsgRemovedFromPlaylist() {
  $('div.removedFromPlaylist').show(100);
  setTimeout(() => {
    $('div.removedFromPlaylist').hide(100);
  }, 4000);
}
function showMsgCreatedPlaylist() {
  $('div.createdPlaylist').show(100);
  setTimeout(() => {
    $('div.createdPlaylist').hide(100);
  }, 4000);
}

var videoSelected;                // this is for grabbing a particular video for operations in the backend. A user will process only one video at a time hence only one variable required

function showCreateOption(ele) {   // for showing the create new playlist form in Add to playlist modal
  $('#createPlaylistDialog').show(100);
  $('#createPlaylistButton').hide(100);
}

$('input[type="checkbox"]').change(function (ele) {
  console.log(ele);
});

function addSongToPlaylist(pid) {      // for adding a video(videoSelected) to a particular playlist(pid) ... a helper function
  $.post('/playlist/addToPlaylist',
    {
      videoId: videoSelected,
      playlistId: pid
    },
    function (data, status) {
      if (status == "success") {
        console.log(data);
        console.log(status);
        showMsgAddedToPlaylist();
      }
      else {
        console.log("some error has occured." + data);
      }
    });
}

function removeSongFromPlaylist(pid) {        // for removing a video(videoSelected) from a particular playlist(pid) ... a helper function
  $.post('/playlist/removeFromPlaylist',
    {
      videoId: videoSelected,
      playlistId: pid
    },
    function (data, status) {
      if (status == "success") {
        console.log(data);
        console.log(status);
        showMsgRemovedFromPlaylist();
      }
      else {
        console.log("some error has occured." + data);
      }
    });
}

function addToThisPlaylist(element) {    // checkbox handler in add to playlist modal .. calls other function based on conditions
  console.log(element);
  if (element.checked == true) {
    addSongToPlaylist(element.value);
  }
  else {
    removeSongFromPlaylist(element.value);
  }
}

function removeFromPlaylist(ele) {     //click handler for remove from playlist button in view playlist page
  videoSelected = ele.dataset.videoid;
  let pid = $('#playlistId').val();   //requires a input field(hidden) with playlist id
  removeSongFromPlaylist(pid);
  $(ele).parent().parent().remove();
}

function createPlaylistFun() {     // this creates new playlist 
  let myform = document.forms['createPlaylistForm'];
  $.post('/playlist/createNew',
    {
      name: myform['name'].value,
      privacy: myform['privacy'].value,
      videoId: myform['videoId'].value
    },
    function (data, status) {
      if (status == "success") {
        myform['name'].value = "";
        showMsgCreatedPlaylist();
        $('#playlistModal').modal('toggle');
        $('#createPlaylistDialog').hide();
        $('#createPlaylistButton').show();

      }
      else {
        console.log("some error has occured." + data);
      }
    }
  )
}

function addThisToPlaylist(element) {      // this function sets the videoSelected variable... is a click handler for add to playlist button
  let videoId = element.dataset.videoid;
  videoSelected = videoId;
  $('input[type="hidden"][name="videoId"]').attr('value', videoSelected);
  $('.modal-body label>input[type="checkbox"]').prop('checked', false);
  let userId = document.getElementById('userID').dataset.id;    // requires userid from a userID div tag
  $.get('/playlist/getAll/' + userId,
    function (data, status) {
      if (status == "success") {
        let ndata;
        console.log(data);
        $('#playlistSectionInModal').html("");
        data.forEach(function (pl) {
          ndata = `<div class='checkbox'>
          <label>
            <input type="checkbox" class="playlistCheckbox" onchange="addToThisPlaylist(this)" value="`+ pl._id + `"> ` + pl.playlistName + `
          </label>
          </div>` ;
          $('#playlistSectionInModal').append(ndata);
        });
        $('#playlistModal').modal('toggle');
      }
    }
  );
}

function sortingHandler(element) {   // handles sorting of playlist on frontend and requests the same in backend
  let t1, t2;
  t1 = "dataset";
  if (element.dataset.type == "alphabetical") {
    t2 = "name";
  }
  else if (element.dataset.type == "dateuploaded") {
    t2 = "dateuploaded";
  }
  else {
    t2 = "views";
  }
  let order = "dsc";
  if (element.dataset.order == "asc") {
    element.dataset.order = "dsc";
    order = "asc";
  }
  else {
    element.dataset.order = "asc";
  }
  let list, i, switching, b, shouldSwitch;
  //list = $("#videoContainer");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // start by saying: no switching is done:
    switching = false;
    b = $("#videoContainer>li");
    // Loop through all list-items:
    for (i = 0; i < (b.length - 1); i++) {
      // start by saying there should be no switching:
      shouldSwitch = false;
      /* check if the next item should
      switch place with the current item: */
      if ((order == "asc" && (b[i][t1][t2] > b[i + 1][t1][t2])) || ((b[i][t1][t2] < b[i + 1][t1][t2]) && order == "dsc")) {
        /* if next item is alphabetically
        lower than current item, mark as a switch
        and break the loop: */
        shouldSwitch = true;
        break;
      }

    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
  let pid = document.getElementById('videoContainer').dataset.playlistid;
  $.post("/playlist/orderPlaylist",
    {
      playlistid: pid,
      type: element.dataset.type,
      order: order
    },
    function (data, status) {
      console.log(data + "::" + status);
    }
  );

}


function reportAbuse(ele) {
  if (confirm('Do you really want to report this video')) {
    console.log("report initiated");
    let videoId = ele.dataset.videoid;
    $.post("/video/reportAbuse",
      {
        videoId: videoId,
      },
      function (data, status) {
        alert(data.message);
      });
  }
}
