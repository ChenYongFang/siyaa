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
 			templateUrl:'views/user.html',
 			css:'/css/user.css'
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

 //compile the head with extra things such like stylesheet、title etc. 
 EMBS.directive('head', ['$rootScope','$compile',
 	function($rootScope, $compile){
 		return {
 			restrict: 'E',
 			link: function(scope, elem){
 				var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
 				elem.append($compile(html)(scope));
 				scope.routeStyles = {};
 				// inject dependencies for state change
 				$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    if(fromState && fromState.css){
                        if(!Array.isArray(fromState.css)){
                            fromState.css = [fromState.css];
                        }
                        angular.forEach(fromState.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if(toState && toState.css){
                        if(!Array.isArray(toState.css)){
                            toState.css = [toState.css];
                        }
                        angular.forEach(toState.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
 			}
 		};
 	}
 ]);