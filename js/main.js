( function() {

	function do_embed( cb ) {

		$.get( 'http://api.instagram.com/oembed?callback=&url=https://www.instagram.com/p/BcQUVbpA3Y8/', function( res, status ) {

			console.log( res, status );

			if ( 'success' === status ) {

				cb( res.html, res.media_id )

			}

		} );

	}

	/**
	 * Retrieve a token from URL
	 * We'll have this during redirects after a user authorizes the app
	 * @return   string|false
	 */
	function get_token_from_url() {

		var hash = window.location.hash.substr( 1 )

		if ( hash ) {

			var result = hash.split( '&' ).reduce( function ( result, item ) {
				var parts = item.split( '=' );
				result[ parts[0] ] = parts[1];
				return result;
			}, {} );

			return result.access_token || false;

		}

		return false;

	}

	/**
	 * Retrieve a token from the URL or local storage
	 * @return   string|false
	 * @since    [version]
	 * @version  [version]
	 */
	function get_token() {

		var new_token = get_token_from_url();

		if ( new_token ) {
			window.localStorage.setItem( 'token', new_token );
			window.location.hash = '';
			return new_token;
		} else {
			var existing_token = window.localStorage.getItem( 'token' );
			if ( existing_token ) {
				return existing_token;
			}
		}

		return false;

	}


	function init_user() {

		$.get( 'https://api.instagram.com/v1/users/self/?access_token=' + get_token(), function( res, status ) {

			console.log( res );

			if ( 'success' === status ) {

				$( '#avatar' ).append( '<img src="' + res.data.profile_picture + '">' );
				$( '#avatar' ).append( '<h3>@' + res.data.username + '</h3>' );

			}

		} );

	}

	function post_comment() {

		var data = {
			access_token: get_token(),
			text: $( '#comment' ).val(),
		};

		$.post( 'https://api.instagram.com/v1/media/' + media_id + '/comments', data, function( res, status ) {
			console.log( res, status );
		} )

	}

	var media_id;

	do_embed( function( html, id ) {

		$( '#embed' ).html( html );
		media_id = id;

	} );

	// hide auth button if we have a token
	if ( get_token() ) {

		init_user();
		$( 'body' ).addClass( 'authorized' );

		$( '#gobutton' ).on( 'click', post_comment );

	}




} )();