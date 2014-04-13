/*
 * angular-embs Application module
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application definition
 * Version: 1.0
 * License: siyaa inc
 */

 var EMBS = angular.module('embs',['ui.router','ui.bootstrap']);

//inject service provider($stateProvider,$urlRouteProvider) into our application

 EMBS.config(function($stateProvider,$urlRouterProvider){

 	// For any unmatched url, redirect to /notfound
 	$urlRouterProvider.otherwise('/notfound');

 	//register user route
 	$stateProvider.state(
 		'user',
 		{
            abstract:true,
 			url:'/user',
 			data:
            {
                css:'/css/user.css'
            },
 			templateUrl:'views/user.html'
 		}
 	)
 	.state(
 		'user.login',
 		{
 			url:'/login',
            controller:'UserLogin',
 			templateUrl:'views/partials/u-login.html'
 		}
 	)

 	//register lottery route
 	.state(
 		'lottery',
 		{
 			url:'/lottery',
 			templateUrl:'views/lottery.html'
 		}
 	);
 	
 });

 //compile the head with extra things such like stylesheet、title etc. 
 EMBS.directive('head', ['$rootScope','$compile',
 	function($rootScope, $compile){
 		return {
 			restrict: 'E',
 			link: function(scope, elem){
 				var html = '<link rel="stylesheet" ng-repeat="cssUrl in routeStyles" ng-href="{{cssUrl}}">';
 				elem.append($compile(html)(scope));
 				scope.routeStyles = {};

 				// inject dependencies for state change
 				$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

 					//delete previous state used css file

                    if(fromState && angular.isDefined(fromState.data) && fromState.data.css){
                        if(!Array.isArray(fromState.data.css)){
                            fromState.data.css = [fromState.data.css];
                        }
                        angular.forEach(fromState.data.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }

                    //inject current state needed css file
                    if(toState && angular.isDefined(toState.data) && toState.data.css){
                        if(!Array.isArray(toState.data.css)){
                            toState.data.css = [toState.data.css];
                        }
                        angular.forEach(toState.data.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
 			}
 		};
 	}
 ]);