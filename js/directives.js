'use strict';

/* Directives */
var myModule = angular.module('fiveseconds.directives', []);


myModule.directive('player', ['version', function() {

	return {
		restrict: 'C',
		link: function($scope, player, attrs) {
		
            player.bind('click', function() {
                
            	alert();

                var videoPlayer = player[0];
                                          
                // Handle play/pause on click
                if (videoPlayer.paused == false) {
                    videoPlayer.pause();
                    $('.playpause').empty().append('Play');
                    $('.playpause').addClass('play');
                } else {
                    videoPlayer.play();
                    $('.playpause').empty().append('Pause');
                    $('.playpause').removeClass('play');
                }
                                          
            });
            
		}
	}
}]);

myModule.directive('playpause', ['version', function() {
	return {
		restrict: 'C',
		link: function($scope, element, attrs) {
			element.bind('click', function() {
				
				var player = $('.player').get(0);
				
				if(!player.paused){
					player.pause();
					$('.playpause').attr('src','img/play.png');
					$('.playpause').addClass('play');
				}
				else{
					player.play();
					$('.playpause').attr('src','img/pause.png');
					$('.playpause').removeClass('play');
				}

			});
		}
	}
}]);