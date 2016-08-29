

$(document).ready(function(){

  var streamers = ["ESL_SC2", "Pooddliedoo", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "MedryBW"];

  var status, url, picture;
  var pic = "http://dummyimage.com/50x50/381761/e8e8e8.jpg&text=0x3F";
  var streamerName, streamerLink;

  function updateOfflineUsers () { //If users are offline, make new ajax request to find user info
		$.ajax({
			url: "https://api.twitch.tv/kraken/channels/" + url,
			dataType: "jsonp",
			data: {format: "json"},
			success: function (json) {
        streamerLink = json.url;
        streamerName = json.display_name;
				status = "Offline";
				if (json.logo !== null) {
					picture = json.logo;
				}
				else {
					picture = 'url("https://cdn.rawgit.com/ayoisaiah/freeCodeCamp/master/twitch/images/placeholder-2.jpg")';
				}
				$(".results").append('<div class="row offline accounts '+streamerName+'"><div class="col-xs-2 col-sm-1" id="icon"><img src="'+picture+'" class="logo" /></div><div class="col-xs-5 col-sm-3" id="name"><a href="'+streamerLink+'" target="_blank">'+streamerName+'</a></div><div class="col-xs-5 col-sm-8" id="status"><p>'+status+'</p></div></div>');
			}
		});
	}

  //use ajax data to generate HTML
  function fetchData (data) {
    if (data.stream === null) {
      url = data._links.channel.substr(38);
      updateOfflineUsers();
    }
    else if (data.status == 422 || data.status == 404) {
      status = data.message.substr(8);
      picture = pic;
      $(".results").append('<div class="row unavailable accounts '+streamerName+'"><div class="col-xs-2 col-sm-1" id="icon"><img src="'+picture+'" class="logo" /></div><div class="col-xs-5 col-sm-3" id="name"><a href="'+streamerLink+'" target="_blank">'+streamerName+'</a></div><div class="col-xs-5 col-sm-8" id="status"><p>'+status+'</p></div></div>');
    }
    else {
      if (data.stream.channel.logo !== null) {
        picture = data.stream.channel.logo;
      }
      else {
        picture = pic;
      }
      streamerName = data.stream.channel.display_name;
      url = data._links.channel.substr(38);
      streamerLink = 'https://twitch.tv/' + url;
      status = data.stream.game;
      $(".results").append('<div class="row online accounts '+streamerName+'"><div class="col-xs-2 col-sm-1" id="icon"><img src="'+picture+'" class="logo" /></div><div class="col-xs-5 col-sm-3" id="name"><a href="'+streamerLink+'" target="_blank">'+streamerName+'</a></div><div class="col-xs-5 col-sm-8" id="status"><p>'+status+'</p></div></div>');
    }
  }

  //ajax call for each streamer
  function ajax () {
    $.ajax({
      url: "https://api.twitch.tv/kraken/streams/" + streamers[i] + "?callback=?",
      dataType: "jsonp",
      data: {
        format: "json"
      },
      success: function (data) {
        streamerName = "Sorry...";
        fetchData(data);
      },
      error: function () {
        console.log("unable to access json");
      }
   });
  }

  //Show only online users
	$('#Online').click(function(){
    $('#All, #Offline').removeClass('active');
    $('#Online').addClass('active');
    $('.unavailable, .offline').slideUp();
    $('.online').slideDown();
  });

	//Show only offline users
  $('#Offline').click(function(){
    $('#All, #Online, #Offline').removeClass('active');
    $('#Offline').addClass('active');
    $('.unavailable, .online').slideUp();
    $('.offline').slideDown();
  });

	//Show all users
	$('#All').click(function(){
    $('#All, #Online, #Offline').removeClass('active');
    $('#All').addClass('active');
    $('.unavailable, .online, .offline').slideDown();
  });

  //initial display
  for (var i = 0; i < streamers.length; i++) {
    ajax();
  }

  //search function (still not totally working)

  function search() {
    var searchValue,
        searchFor;
    searchValue = $(".search-query").val();
    if (searchValue.length === 0) {
      $('.unavailable, .online, .offline').slideDown();
    }

    if (searchValue.length > 1) {
      $('.unavailable, .online, .offline').slideUp();
      //--------------------- FROM here ---
      for (var i = 0; i<streamers.length; i++) {
        var searchID = searchValue.toLowerCase();
        var streamerID = streamers[i].toLowerCase();
        if (searchID === streamerID){
          searchFor = streamers[i];
        }
      }

      $('.'+ searchFor).slideDown();
    }
    //--------------------- TO here is what doesn't work ---
    $('.search-query').unbind('keyup');
    $('.search-query').keyup(function() {
      search();
    });
  }

  $('.search-query').keyup(function() {
    search();
  });

});
