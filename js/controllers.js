'use strict';

/* Controllers */

function routeurCtrl($scope, $navigate){
	// Check local storage and redirect
	
	var user_email = localStorage['user_email'];
	var user_code_tmp = localStorage['user_code_tmp'];

	if(typeof user_email != 'undefined'){
		$navigate.go('/record');
	}
	else if(typeof user_code_tmp != 'undefined'){
		$navigate.go('/login-code');
	}
	else{
		localStorage['localize_dict'] = '';
		$navigate.go('/what_is_it');
	}
}

function what_is_itCtrl($scope, $navigate){
	$scope.$navigate = $navigate;
}

function loginCtrl($scope, $navigate, $http, localize){
	$scope.$navigate = $navigate;
	$scope.title = localize.translate('_login_');
	
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	
	$scope.auth = function() {
		if($scope.email != '' && typeof $scope.email != 'undefined' && filter.test($scope.email)){
			$scope.emailClass = 'noBorder';

			// To lower case
			$scope.email = $scope.email.toLowerCase();
			
			$http({ method: 'POST', url: 'http://fiveseconds.me/api/users/show', data: {'API_KEY': 'juqCIEkr8uEBY0jW3wnFGVtmNPcQvN9qIjJKAtYWqAo0Ngojrd2UjeWTZ9cEq0D3bslANfBHWh0bHkcPi8sIWFv6RDYYK3sE4WI9'} }).
			  success(function (data, status, headers, config) {
			  
			  	var found = 0;
			  				  	
			  	if(data.returnStatus == '1'){
				 	data.users.forEach(function(user) {
					    // Test if exists
					    if(user.email_user == $scope.email){
						    found = 1;
					    }
				    }); 	
			  	}
			  				    
			    if(found == 0){
				    // Authentificate
				    
				    // Save email in API
				    $http({ method: 'POST', url: 'http://fiveseconds.me/api/users/add', data: {'API_KEY': 'juqCIEkr8uEBY0jW3wnFGVtmNPcQvN9qIjJKAtYWqAo0Ngojrd2UjeWTZ9cEq0D3bslANfBHWh0bHkcPi8sIWFv6RDYYK3sE4WI9', 'email_user' : $scope.email} });
				    
				    // Set email in localstorage
				    localStorage['user_email'] = $scope.email;
				    
				    // Init
				    localStorage['last_video_uploaded'] = 'none';
				    localStorage['last_timeline_refresh'] = 'none';
				    localStorage['last_discover_refresh'] = 'none';
				    localStorage['refreshTimeline'] = 'no';
				    
				    // Redirect to /record
				    $navigate.go('/record');
			    }
			    else{
			    	
			    	$http({ method: 'POST', url: 'http://fiveseconds.me/api/users/email_auth', data: {'API_KEY': 'juqCIEkr8uEBY0jW3wnFGVtmNPcQvN9qIjJKAtYWqAo0Ngojrd2UjeWTZ9cEq0D3bslANfBHWh0bHkcPi8sIWFv6RDYYK3sE4WI9', 'email_user' : 													$scope.email} }).success(function (data, status, headers, config) {
				    	
				    	// Set email in localstorage -- TMP --
				    	localStorage['user_email_tmp'] = $scope.email;
				    	
				    	// Set code in localstorage -- TMP --
				    	localStorage['user_code_tmp'] = data.code_user;
				    	
				    	// Redirect 
				    	$navigate.go('/login-code');
				    	
			    	});
			    }
			    
			  }).
			  error(function (data, status, headers, config) {
			  	$scope.emailClass = 'red';
			    console.log('API request error');
			  });
		}
		else{
			$scope.emailClass = 'red';
		}
	};
}

function loginCodeCtrl($scope, $navigate, localize){
	$scope.$navigate = $navigate;
	$scope.title = localize.translate('_login_');
	
	$scope.verify = function() {
		
		var user_code_tmp = localStorage['user_code_tmp'];
		
		if($scope.code_login == user_code_tmp){
			$scope.codeClass = 'noBorder';
			
			// Set email in localstorage
			localStorage['user_email'] = localStorage['user_email_tmp'];
				    
			// Init
			localStorage['last_video_uploaded'] = 'none';
			localStorage['last_timeline_refresh'] = 'none';
			localStorage['last_discover_refresh'] = 'none';
			localStorage['refreshTimeline'] = 'no';

			// Empty tmp
			delete localStorage['user_code_tmp'];
			delete localStorage['user_email_tmp'];
			
			// Redirect to /record
			$navigate.go('/record');
		}
		else{
			$scope.codeClass = 'red';	
		}
		
	};
}

function recordCtrl($scope, $navigate, localize, apiCall){
	$scope.$navigate = $navigate;
	
	$scope.btnText = localize.translate('_capturefivesecondsofyourday_');
	$scope.btnClass = '';

	var lastshoot = localStorage['last_video_uploaded'];

	var today								= new Date();
		today								= today.toDateString();

	// Pre load #Discover
	if(PastDate(localStorage['last_discover_refresh'])){

		$('.loading').fadeIn();

		apiCall.discover().then(function() {
   			$('.loading').fadeOut();
		});
	}
	// Pre load #Timeline
	if(PastDate(localStorage['last_timeline_refresh'])){

		$('.loading').fadeIn();

		var email_user = localStorage['user_email'];
		apiCall.timeline(email_user).then(function() {
   			$('.loading').fadeOut();
		});
	}

	$scope.recorder = function() {
		// Ony if it's the first of the day
		if(lastshoot != today){
			// Show upload view
			$navigate.go('/upload','none');
		}
		else{
			// Notification PhoneGap
			navigator.notification.alert(
			    localize.translate('_onlyFiveSeconds_'),
			    null,
			    localize.translate('_sorry_'),
			    localize.translate('_seeyou_')
			);
		}
	}

	// Message
	$scope.messageClass = '';
	if(lastshoot == today){
		$scope.messageClass = 'hide';

		$scope.btnText = localize.translate('_enough_');
		$scope.btnClass = 'white';
	}
	else if(lastshoot == 'none'){
		$scope.messageClass = 'show';
		$scope.message = localize.translate('_nevercaptured_');
	}
	else{
		$scope.btnClass = '';
		$scope.messageClass = 'show';
		$scope.message = localize.translate('_neverforget_');
	}

	// Check auth
	var user_email = localStorage['user_email'];
	if(typeof user_email == 'undefined'){
		$navigate.go('/what_is_it','none');
	}
}

function uploadCtrl($scope, $navigate, localize, apiCall){
	$scope.$navigate = $navigate;
	$scope.title = localize.translate('_record_');

	// Init share url
	$scope.shareUrl = 'http://fiveseconds.me/share/video/404';

	var networkState = navigator.connection.type;
	var states = {};
                    states[Connection.UNKNOWN]  = 0;
                    states[Connection.ETHERNET] = 1;
                    states[Connection.WIFI]     = 1;
                    states[Connection.CELL_2G]  = 0;
                    states[Connection.CELL_3G]  = 1;
                    states[Connection.CELL_4G]  = 1;
                    states[Connection.CELL]     = 1;
                    states[Connection.NONE]     = 0;

    if(states[networkState]){
    	// Launch capture
		navigator.device.capture.captureVideo(captureSuccess, captureError, {duration: 5, limit: 1});
    }
    else{
    	$navigate.go('/record','none');
    }

	function captureSuccess(mediaFiles) {

 		$('.uploadStatus').empty().html(localize.translate('_upload_'));

		// Launch upload...
		uploadFile(mediaFiles[0]);
	}

	function uploadFile(mediaFile) {
		var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;
    
        ft.upload(path,
            "http://fiveseconds.me/api/videos/upload",
            function(result) {

            	var responseAPI = JSON.parse(result.response);
            	$scope.thumb = responseAPI.metadata.thumb;

            	if(responseAPI.returnStatus == 1){
            		$('.thumbContainer-img').css('background-image', 'url('+$scope.thumb+')');
            		$('.uploadStatus').empty().html(localize.translate('_uploadsuccess_'));
            		$('.loader').fadeOut();

            		// Update share url
            		$scope.shareUrl = responseAPI.metadata.share;

            		// Update localstorage last shoot
            		var today								= new Date();
					localStorage['last_video_uploaded'] 	= today.toDateString();

					// Remove button not-ready class
					$('.share button').removeClass('not-ready');

					// Refresh timeline
					$('.loading').fadeIn();

					var email_user = localStorage['user_email'];
					apiCall.timeline(email_user).then(function() {
			   			$('.loading').fadeOut();
					});
            	}
            	else{
            		$('.uploadStatus').empty().html(localize.translate('_videoerrorconnectivity_'));
            		$('.loader').fadeOut();

            		$navigate.go('/record','none');
            	}
            },
            function(error) {            	
            	$('.loader').fadeOut();

				var msg = localize.translate('_videoerrorconnectivity_');
		        navigator.notification.alert(msg, null, 'Uh oh!');

		        $navigate.go('/record','none');
            },
            { fileName: name, fileKey: 'file', params : {email: localStorage['user_email'], API_KEY: "juqCIEkr8uEBY0jW3wnFGVtmNPcQvN9qIjJKAtYWqAo0Ngojrd2UjeWTZ9cEq0D3bslANfBHWh0bHkcPi8sIWFv6RDYYK3sE4WI9"} });
	}

	function captureError(error) {
		$('.loader').fadeOut();

        if(error.code == 20){
        	var msg = localize.translate('_nocamera_');
        	navigator.notification.alert(msg, null, 'Uh oh!');

        	window.location.href="#/record";
        }
        else{
        	window.location.href="#/record";
        }
	}

	$scope.Share = function() {

		// Check if button ready
		if(!$('.share button').hasClass('not-ready')){

			cordova.exec(function(avail) {
				if(avail){

					// Share sys available on iOS : launch
					cordova.exec(null, null, "Social", "share", [localize.translate('_checkoutshare_')+' '+$scope.shareUrl, '', '']);
				}
			}, null, "Social", "available", []);
		}
		else{
			navigator.notification.alert(
		    localize.translate('_waitfortheupload_'),
		    null,
		    localize.translate('_bepatient_'),
		    'Ok'
		);
		}
	}

	// Check auth
	var user_email = localStorage['user_email'];
	if(typeof user_email == 'undefined'){
		$navigate.go('/what_is_it','none');
	}
}

function discoverCtrl($scope, $navigate, $http, localize, apiCall){
	$scope.$navigate = $navigate;
	$scope.title = localize.translate('_discover_');

	// Data call or localstorage
	var lasttime = localStorage['last_discover_refresh'];

	$scope.discover = JSON.parse(localStorage['discover']);

	// Open play modal view
	$scope.openPlay = function(url, thumb, date, feeling) {

		var currentDiscover = {'url': url, 'thumb': thumb, 'date': date, 'feeling': feeling};
		localStorage["current_video_discover"] = JSON.stringify(currentDiscover);
		
		$navigate.go('/play','none');
	}
				
	// Check auth
	var user_email = localStorage['user_email'];
	if(typeof user_email == 'undefined'){
		$navigate.go('/what_is_it','none');
	}
}

function timelineCtrl($scope, $navigate, $http, localize, apiCall){

	$scope.$navigate = $navigate;
	$scope.title = localize.translate('_timeline_');
	
		if(localStorage['timeline'] != 'empty'){
			$scope.timeline = JSON.parse(localStorage['timeline']);
		}
		else{
			
			navigator.notification.alert(
			    localize.translate('_nevercaptured_'),
			    null,
			    'Oh no :-(',
			    localize.translate('_close_')
			);

			$navigate.go('/record','none');
	    }

	$scope.Share = function(share_url) {

			cordova.exec(function(avail) {
				if(avail){

					// Share sys available on iOS : launch
					cordova.exec(null, null, "Social", "share", [localize.translate('_checkoutshare_')+' http://fiveseconds.me/share/video/'+share_url, '', '']);
				}
			}, null, "Social", "available", []);
	};

		/* Timeline design */
		var currentElement = 0;

		$scope.current = $scope.timeline[currentElement];
		var sizeElements = Object.size($scope.timeline) -1;
		
		if(sizeElements == 0){
			$scope.displayNext = 'hide';
		}

		// On load, hide previous btn...
		$scope.displayPrevious = 'hide';
		
		$scope.nextElement = function(e){
			currentElement++;
			
			$('.view').slideUp(200);
			
			$scope.displayPrevious = 'show';
			
			$scope.current = $scope.timeline[currentElement];

			$('.videoContainer').empty().html('<video class="player" preload="auto" poster="'+$scope.timeline[currentElement].thumb_video+'"><source src="'+$scope.timeline[currentElement].url_video+'" type="video/mp4" /></video>');

			$('.view').slideDown(200);
			
			// Check when it's the last element
			if(currentElement == sizeElements){
				$scope.displayNext = 'hide';
			}
		}
		
		$scope.previousElement = function(){
			currentElement--;
			
			$('.view').slideUp(200);
			
			$scope.displayNext = 'show';
			
			$scope.current = $scope.timeline[currentElement];
			
			// Load the video
			$('.videoContainer').empty().html('<video class="player" preload="auto" poster="'+$scope.timeline[currentElement].thumb_video+'"><source src="'+$scope.timeline[currentElement].url_video+'" type="video/mp4" /></video>');

			$('.view').slideDown(200);
			
			// Check when it's the last element
			if(currentElement == 0){
				$scope.displayPrevious = 'hide';
			}
		}

	// Check auth
	var user_email = localStorage['user_email'];
	if(typeof user_email == 'undefined'){
		$navigate.go('/what_is_it','none');
	}
}

function playCtrl($scope, $navigate, localize){
	$scope.$navigate = $navigate;
	$scope.title = localize.translate('_play_');
	
	// Put the data in the $scope
	$scope.current = JSON.parse(localStorage["current_video_discover"]);
	// re-init localstorage for currentVideoDiscover
	localStorage["current_video_discover"] = '';

	$scope.Report = function() {

		navigator.notification.alert(
			    'This video was reported, our team will check within 24h.',
			    null,
			    'Reporting',
			    localize.translate('_close_')
			);
	};

	// Check auth
	var user_email = localStorage['user_email'];
	if(typeof user_email == 'undefined'){
		$navigate.go('/what_is_it','none');
	}
}

////////////////////////// Lib ////////////////////////////

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function PastDate(date_string){
	
	var date_to_test = Date.parse(date_string);
	var now = new Date();
	
	if(date_string == 'none'){
		// First time
		return true;
	}
	
	// If it's in the past
	if (date_to_test < now) {
	    
	    // If the date is not today
	    if(new Date(date_string).toDateString() != now.toDateString())
	    {
	    	// In the past
	    	return true;
	    }
	    else{
	    	// Now
		    return false;
	    }
	}
	else{
		// In the future
		return false;
	}
}