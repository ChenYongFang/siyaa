/*
 * angular-embs Application module
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application definition
 * Version: 1.0
 * License: siyaa inc
 */

 /* regist some common function for angular */

 // serialize from object data
 angular.params = function(params){
    if (!params) return;

    var parts = [];

    angular.forEach(params,function(value,key){
        if (value === null || angular.isUndefined(value)) return;
        if (!angular.isArray(value)) value = [value];

        angular.forEach(value,function(v){
            //current unsupport the nesting object or array.
            if (angular.isObject(v)) {
                v = angular.toJson(v);
            }
            parts.push(key + '=' + v);
        })
    });

    return parts.join('&');
 }

 var EMBS = angular.module('embs',['ui.router','ui.bootstrap']);

//inject service provider($stateProvider,$urlRouteProvider) into our application

 EMBS.config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$httpProvider){

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
                title:'用户中心',
                css:'/css/user.css'
            },
 			templateUrl:'views/user.html'
 		}
 	)
 	.state(
 		'user.login',
 		{
 			url:'/login',
            title:'-用户登录',
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

    //set default http header application/x-www-form-urlencoded
    //$httpProvider.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'};
 	
 }]);

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

                    //change the page's title base on state
                    var parentTitle = '';
                    if(toState.data){
                        parentTitle = toState.data.title || '';
                    }
                    elem.find('title').text(parentTitle + toState.title);

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