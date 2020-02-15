$(document).ready(function () {
  let notiCount;
  $.post('/subscribe/getNotifs',
    {},
    function (data, status) {
      if (status == "success") {
        //let data = JSON.parse(data1);
        console.log(data);
        notiCount = data.unread;

        //var nodeItems =  window.localStorage.getItem('nodeItems');
        $('.noti-count').html(notiCount);
        $('#nav-noti-count').css('display', 'inline-block');
        data.notifs.forEach(element => {
          let atag = '<div class="noti-div"><a class="noti-a" href="/play/' + element.link + '">' + element.fromName + ' added a new video. Check it out.</a><div class="noti-time" data-notifTime="' + Date.parse(element.notifTime) + '">Just now</div></div>';
          if (element.notifType == "admin removed video") {
            atag = '<div class="noti-div"><a class="noti-a" href="#">' + element.fromName + ' has removed your video named ' + element.link + ' due to objectionalable content. Please refrain from uploading such videos again.</a><div class="noti-time" data-notifTime="' + Date.parse(element.notifTime) + '">Just now</div></div>';
          }
          let liClass = 'noti-text';
          if (element.isRead == true) {
            liClass = liClass + ' has-read';
          }
          let childItem = $('<li>').attr({ 'class': liClass, 'data-notifId': element._id }).append(atag);
          childItem = Array.prototype.slice.call(childItem);
          $('.noti-body').prepend(childItem);
          $('.noti-body .noti-text').on('click', function (evt) {
            addClickListener(evt);
          });
        });
        updateNotifTime();
      }
    }
  );

  let updateNotifTime = function () {
    let notifs = $('.noti-div>.noti-time');
    notifs = Array.prototype.slice.call(notifs);
    let currTime = Date.now();
    let diff;
    notifs.forEach((item) => {
      // console.log(item.dataset.notiftime);

      diff = currTime - parseInt(item.dataset.notiftime, 10);
      if (diff < 3600000) {
        item.innerHTML = (diff - (diff % 60000)) / 60000 + ' min ago';
      }
      else if (diff < 3600000 * 24) {
        item.innerHTML = (diff - (diff % (60000 * 60))) / (60000 * 60) + ' hour ago';
      }
      else {
        item.innerHTML = (diff - (diff % (60000 * 60 * 24))) / (60000 * 60 * 24) + ' days ago';
      }
    });
  };

  setInterval(updateNotifTime, 60000);

  $('#noti-tab').click(function () {
    notiTabOpened = true;
    if (notiCount) {
      $('#nav-noti-count').fadeOut('slow');
      // $('.noti-title').css('display', 'inline-block');
    }
    $('.noti-container').toggle(300);
    return false;
  });

  $('.noti-body .noti-text').on('click', function (evt) {
    addClickListener(evt);
  });

  var addClickListener = function (evt) {
    evt.stopPropagation();
    if (!$(evt.currentTarget).hasClass('has-read')) {
      $(evt.currentTarget).addClass('has-read');
      $.post('/subscribe/markRead',             //ajax request to mark as read
        {
          howMany: 'one',
          notifId: $(evt.currentTarget).attr('data-notifId')

        },
        function (data, status) {
          if (status == "success") {
            console.log("notif marked read");
          }
        }
      );
    }
  }

  $('.noti-footer').click(function () {
    notiCount = 0;
    $.post('/subscribe/markRead',             //ajax request to mark as read
      {
        howMany: 'all',

      },
      function (data, status) {
        if (status == "success") {
          console.log("notif marked read");
        }
      }
    );
    $('.noti-text').addClass('has-read');
  });

  $('#profile-button').click(function () {
    $('.profile-section').toggle(300);
    return false;
  });
});


