/*
 * angular-embs Application module
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application definition
 * Version: 1.0
 * License: MIT
 */
 var EMBS = angular.module('embs',['ngRoute']);

//inject service provider (routeProvider)
 EMBS.config(['$routeProvider',function($routeProvider){
 	// register user route
 	$routeProvider.when(
 		'/user/login',
 		{
 			templateUrl:'views/partials/u-login.html'
 			resolve:
 			{
 				//register controller dependencies whitch like css style...
 				style:function(){

 				}
 			}
 		}
 	)
 	.when(
 		'/user/register',
 		{
 			templateUrl:'views/partials/u-register.html'
 		}
 	)


 	//register chtone route
 	.when(
 		'chtone/login',
 		{
 			templateUrl:'views/partials/ct-login.html'
 		}
 	)
 	.when(
 		'chtone/register',
 		{
 			templateUrl:'views/partials/ct-register.html'
 		}
 	)

 	//register other route
 	.otherwise(
 		{
 			redirectTo:'notfound.html'
 		}
 	);
 }]);