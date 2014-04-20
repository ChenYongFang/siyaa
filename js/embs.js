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

 var EMBS = angular.module('embs',['ui.router','ui.bootstrap','userModule','marketModule']);

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

    //register market route
    .state(
        'market',
        {
            abstract:true,
            url:'/market',
            data:
            {
                title:'微商城',
                css:'/css/market.css'
            },
            controller:'Market',
            templateUrl:'views/market.html'
        }
    )
    .state(
        'market.home',
        {
            url:'/home',
            title:'-首页',
            css:'/css/market-two.css',
            templateUrl:'views/partials/market-two.html',
            controller:'MarketHome'
        }
    )
    .state(
        'market.big',
        {
            url:'/big',
            title:'-首页',
            css:'/css/market-one.css',
            templateUrl:'views/partials/market-one.html',
            controller:'MarketHome'
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


 /* EMBS application directive section */
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

                        //merged all css file url. 
                        var csses = toState.data.css;

                        if(!Array.isArray(csses)){
                            csses = [csses];
                        }
                        //inject descendant view's css file
                        if(angular.isDefined(toState.css)){
                            if(!Array.isArray(toState.css)){
                                toState.css = [toState.css];
                            }
                            csses = csses.concat(toState.css);
                        }
                        angular.forEach(csses, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
 			}
 		};
 	}
 ]);


/* EMBS application filter section */
EMBS.filter('stepSize',function(){
    return function(data,value){
        var newData = [];
        for(var i = 0; i < data.length; i+=value){
            newData.push(data[i]);   
        }
        return newData;
    }
})