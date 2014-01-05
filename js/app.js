'use strict';

var myApp = angular.module('myApp', ['myApp.services', 'localization', 'apiCalls', 'myApp.directives','ajoslin.mobile-navigate','ngMobile'])
    .config(function ($compileProvider){
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .config(['$routeProvider', function($routeProvider) {  
          
        $routeProvider.when('/', {controller: 'routeurCtrl'});
        $routeProvider.when('/what_is_it', {templateUrl: 'views/what_is_it.html'});
        $routeProvider.when('/login', {templateUrl: 'views/login.html'});
        $routeProvider.when('/login-code', {templateUrl: 'views/login-code.html'});
        $routeProvider.when('/record', {templateUrl: 'views/record.html'});
        $routeProvider.when('/discover', {templateUrl: 'views/discover.html'});
        $routeProvider.when('/timeline', {templateUrl: 'views/timeline.html'});
        $routeProvider.when('/play', {templateUrl: 'views/play.html'});
        $routeProvider.when('/upload', {templateUrl: 'views/upload.html'});

        $routeProvider.otherwise({redirectTo: '/'});
  }]);