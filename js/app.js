
$(document).ready(function(){
	console.log('ready');
	document.addEventListener('deviceready', onDeviceReady, false);

});

function onDeviceReady() {
	// check localStorage for channel

	if(localStorage.channel == null || localStorage.channel == '') {
		 // ask user for channel
		 $('#popupDialog').popup("open");
	} else {
		var channel = localStorage.getItem('channel');
	} 

	// var channel = 'coachingbadminton';

	getPlaylist(channel);

	$(document).on('click', '#vidList li', function() {
		showVideo($(this).attr('videoId'));
	});

	$('#channelBtnOk').click(function(){
		var channel = $('#channelName').val();
		setChannel(channel);
		getPlaylist(channel);
	});

	$('#saveOptions').click(function(){
		saveOptions();
	})

	$('#clearChannel').click(function(){
		clearChannel();
	});

	$(document).on('pageinit', '#options', function(){
		var channel = localStorage.getItem('channel');
		var maxResults = localStorage.getItem('maxResults');
		$('#channelNameOptions').attr('value', channel);
		$('#maxResultsOptions').attr('value', maxResults);
	});
}

function getPlaylist(channel) {
	// console.log('getPlaylist called...');
	$('#vidList').html('');

	if(localStorage.maxResults == null || localStorage.maxResults == '') {
		maxResults = 10;
	} else {
		var maxResults = localStorage.getItem('maxResults');
	}


	$.get(
			'https://www.googleapis.com/youtube/v3/channels',
			{
				part: 'contentDetails',
				forUsername: channel,
				key: 'AIzaSyCol0LQb7HjJ5vsA1FAatzEGQhwHOwM-4o'
			})
			.done(
				function(data) {
					$.each(data.items, function(i, item){
						// console.log(item);
						playlistId = item.contentDetails.relatedPlaylists.uploads;
						getVideos(playlistId, maxResults);
					});
				}
			);
}

function getVideos(playlistId, maxResults) {
	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems",
		{
			part: "snippet",
			maxResults: maxResults,
			playlistId: playlistId,
			key: "AIzaSyCol0LQb7HjJ5vsA1FAatzEGQhwHOwM-4o"
		}
		).done(function(data) {
			// console.log(data);
			$.each(data.items, function(i, item) {
				id = item.snippet.resourceId.videoId;
				title = item.snippet.title;
				thumb = item.snippet.thumbnails.default.url;

				$('#vidList').append('<li videoId="'+ id +'"><img src="'+thumb+'"><h2>'+title+'</h2></li>');
				$('#vidList').listview('refresh');

			})
		});

}

function showVideo(id) {
	// console.log('showing video ID: '+id);
	$('#logo').hide();
	var output = '<iframe width="100%" height="250" src="http://www.youtube.com/embed/'+id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>';
	$('#showVideo').html(output);
}

function setChannel(channel) {
	localStorage.setItem('channel', channel);
	console.log('channel set: ' + channel);
}

function setMaxResults(maxResults) {
	localStorage.setItem('maxResults', maxResults);
	console.log('maxResults set: ' + maxResults);
}

function saveOptions() {
	var channel = $('#channelNameOptions').val();
	var maxResults = $('#maxResultsOptions').val();
	setChannel(channel);
	setMaxResults(maxResults);
	$(':mobile-pagecontainer').pagecontainer('change', '#home', {
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	getPlaylist(channel);
}

function clearChannel() {
	localStorage.removeItem('channel');
	$(':mobile-pagecontainer').pagecontainer('change', '#home', {
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
    $('#vidList').html('');
    $('#popupDialog').popup('open');
}

