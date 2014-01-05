'use strict';

angular.module('apiCalls', [])
    // localization service responsible for retrieving resource files from the server and
    // managing the translation dictionary
    .factory('apiCall', ['$http', '$rootScope', '$window' , function ($http, $rootScope, $window) {

        var apiCall = {
            
            discover: function() {

                var call = $http({ method: 'POST', url: 'http://fiveseconds.me/api/videos/discover', data: {'API_KEY': 'juqCIEkr8uEBY0jW3wnFGVtmNPcQvN9qIjJKAtYWqAo0Ngojrd2UjeWTZ9cEq0D3bslANfBHWh0bHkcPi8sIWFv6RDYYK3sE4WI9'} })
				.then(function(response) {

					var discoverData = null;
			        
					if(response.data.returnStatus == 1){
						
						localStorage["discover"] = JSON.stringify(response.data.videos);
						discoverData = response.data.videos;

						// Update localStorage
						var today								= new Date();
						localStorage['last_discover_refresh'] 	= today.toDateString();

					}
					else{

						discoverData = JSON.parse(localStorage['discover']);
						localStorage["discover"] = discoverData;

					}

					return discoverData;
			    });

			    return call;

            },
            timeline: function(email_user) {

                var call = $http({ method: 'POST', url: 'http://fiveseconds.me/api/videos/timeline', data: {'API_KEY': 'juqCIEkr8uEBY0jW3wnFGVtmNPcQvN9qIjJKAtYWqAo0Ngojrd2UjeWTZ9cEq0D3bslANfBHWh0bHkcPi8sIWFv6RDYYK3sE4WI9', 'email_user' : email_user} })
				.then(function(response) {

					var timelineData = null;
			        
					if(response.data.returnStatus == 1){
						
						localStorage["timeline"] = JSON.stringify(response.data.timeline);
						timelineData = response.data.timeline;

						// Update localStorage
						var today								= new Date();
						localStorage['last_timeline_refresh'] 	= today.toDateString();

					}
					else{

						timelineData = 'empty';
						localStorage["timeline"] = 'empty';
					}

					return timelineData;
			    });

			    return call;

            }
        };

        // return the local instance when called
        return apiCall;

    } ]);