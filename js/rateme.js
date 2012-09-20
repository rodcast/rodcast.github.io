(function($) {
  "use strict";

  var albumsList = [],
	  photosList = [];

  FB.init({
	appId: '420083701382995',
	status: true,
	cookie: true,
	xfbml: true,
	oauth: true
  });

  function authFacebookAccount() {
  FB.login(function(response) {
	if (response.authResponse) {
	  getMyAlbums();
	} else {
	  alert('User cancelled login!');
	}
  }, {scope: 'email,user_photos,user_likes'});
  }

  function getMyAlbums() {
	var count_photos = 0;
	
	FB.api('/me/albums', function(response) {
		$.each(response.data, function(i, albums) {
			count_photos = albums.count || 0;

			if (count_photos) {
			  albumsList.push('<li data-count="' + count_photos + '"><a href="#" class="album" data-album="' + albums.id + '">' + albums.name + '</a> (' + count_photos + ')</li>');
			}
		});

		showAlbums();
		setEventAlbums();
	});
  }

  function getPhotos(id) {
	var photo_name,
		count_likes = 0;

	FB.api('/' + id + '/photos', function(response) {
		$.each(response.data, function(i, photo) {
			$.each(photo.images, function(i, images) {
				if (~images.source.indexOf('320x320')) {
					count_likes = (photo.likes ? photo.likes.data.length : 0);
					photo_name = (photo.name ? '<span class="name">' + photo.name + '</span>' : '');
					photosList.push('<li data-likes="' + count_likes + '"><a href="' + images.source + '" class="photo"><span class="likes">' + count_likes + '</span>' + photo_name + '<img src=' + images.source + ' class="image"></a></li>');
				}
			});
		});

		showPhotos();
		setEventPhotos();
	});
  }

  function compare(a, b) {
	  return b - a;
  }

  function showAlbums() {
	  $('#albums').html('').append(albumsList.sort(compare).join(""));

	  albumsList = [];
  }

  function showPhotos() {
	  $('#photos').html('').append(photosList.sort(compare).join(""));
	  
	  photosList = [];
  }

  function setEventAlbums() {
	  $('.album').on('click', function(event) {
		  getPhotos($(this).data('album'));

		  event.preventDefault();
	  });
  }

  function setEventPhotos() {
	  $('.photo').bind('click', function(event) {
		  FB.ui({
			method: 'apprequests',
			title: 'I\'m better than you.',
			message: 'I have ' + $(this).parent().data('likes') + ' like(s) in that picture and you? See and be happy!'
		  });

		  event.preventDefault();
	  });
  }

  authFacebookAccount();
})(jQuery, undefined);