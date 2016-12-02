var scotchApp = angular.module('bingSearch', ['ngRoute','ui.bootstrap','angularUtils.directives.dirPagination','ngDialog']);
var TABroute= "HTTS";
scotchApp.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'homeController'
        })
        .otherwise({
            templateUrl : 'pages/home.html',
            controller  : 'homeController'
        });
});




