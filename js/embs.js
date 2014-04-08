/*
 * angular-embs Application module
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application definition
 * Version: 1.0
 * License: siyaa inc
 */

 var EMBS = angular.module('embs',['ui.router']);

//inject service provider($stateProvider,$urlRouteProvider) into our application

 EMBS.config(function($stateProvider,$urlRouterProvider){

 	// For any unmatched url, redirect to /notfound
 	$urlRouterProvider.otherwise('/notfound');

 	//register user route
 	$stateProvider.state(
 		'user',
 		{
 			url:'/user',
 			templateUrl:'views/user.html'
 		}
 	)
 	.state(
 		'user.login',
 		{
 			url:'/login',
 			templateUrl:'views/partials/u-login.html'
 		}
 	);
 	
 });