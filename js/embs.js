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

 var EMBS = angular.module('embs',['ui.router','ui.bootstrap','userModule','marketModule','lotteryModule']);

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
    .state(
        'user.myrecom',
        {
            url:'/myrecom',
            title:'-我的推荐人',
            css:'/css/myrecom.css',
            templateUrl:'views/partials/u-myrecom.html'
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
        'market.goods',
        {
            url:'/goods/:tid',
            title:'-首页',
            css:'/css/type-goods.css',
            templateUrl:'views/partials/type-goods.html',
            controller:'MarketTypeGoods'
        }
    )
    .state(
        'order',
        {
            abstract:true,
            url:'/market/order',
            data:
            {
                title:'微商城-订单',
                css:'/css/order.css'
            },
            templateUrl:'views/order.html'
        }
    )
    .state(
        'order.list',
        {
            url:'/list',
            title:'列表',
            templateUrl:'views/partials/order-list.html'
        }
    )
    .state(
        'order.waitpay',
        {
            url:'/waitpay',
            title:'待付款列表',
            templateUrl:'views/partials/order-wait-pay.html'
        }
    )


 	//register lottery route
 	.state(
 		'lottery',
 		{
            //红色抽奖模板
            abstract:true,
 			url:'/lottery',
            data:
            {
                title:'抽奖',
                css:'/css/lottery-red.css'
            },
 			templateUrl:'views/lottery-red.html'
 		}
 	)
    .state(
        'lottery.wheel',
        {
            //转盘
            url:'/wheel',
            title:'-大转盘',
            css:'/css/lottery-wheel.css',
            controller:'LotteryWheel',
            templateUrl:'views/partials/lottery-wheel.html'
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
 ])
//infinit scroll for data handl
 .directive('infiniteScroll',['$window','$timeout',function($window,$timeout){
    return {

        restrict: 'A',

        scope: {

            infiniteScroll: '&',

            scrollContainer: '=',

            scrollDistance: '=',

            scrollDisabled: '='

        },

        link:function(scope,elem,attrs){

            var changeContainer , checkWhenEnable , container , handleScrollContainer ,

            handleScrollDisabled , handleScrollDistance , handler , immediateCheck ,

            scrollDistance , scrollEnable;

            // jqLite window DOM object
            $window = angular.element($window);

            scrollDistance = null;

            scrollEnabled = null;

            checkWhenEnabled = null;

            container = null;

            immediateCheck = true;

            // check when needs to do scroll stuff.
            handler = function(){

                var containerBottom , elementBottom , remaining , shouldScroll;

                if(container === $window){
                    containerBottom = container[0].innerHeight + container[0].scrollY;
                    elementBottom = elem[0].offsetTop + elem[0].offsetHeight;
                }else{
                    containerBottom = container[0].offsetHeight;
                    elementBottom = elem[0].offsetTop - container[0].offsetTop + elem[0].offsetHeight;
                }

                remaining = elementBottom - containerBottom;

                shouldScroll = remaining <= container[0].innerHeight * scrollDistance + 1;

                if(shouldScroll && scrollEnabled){
                    //start do scroll stuff.
                    return scope.infiniteScroll();
                }else if(shouldScroll){
                    //if should scroll immediate set checkWhenEnable to be true
                    return checkWhenEnabled = true;
                }
            };

            //element destroy trans.
            scope.$on('$destroy',function(){
                return container.off('scroll',handler);
            });

            //set scroll distance
            handleScrollDistance = function(v){
                return scrollDistance = parseInt(v,10) || 0;
            };

            //when template change it's scrollDistance attr immediate set the scrollDistance
            scope.$watch('scrollDistance',handleScrollDistance);

            handleScrollDisabled = function(v){
                scrollEnabled = !v;
                if(scrollEnabled && checkWhenEnabled){
                    checkWhenEnabled = false;
                    return handler();
                }
            };

            scope.$watch('scrollDisabled',handleScrollDisabled);

            handleScrollDisabled(scope.scrollDisabled);

            changeContainer = function(newContainer){

                if(container != null){
                    container.off('scroll',handler);
                }
                container = newContainer;
                if(container != null){
                    return container.on('scroll',handler);
                }
            };
            // init container to be window
            changeContainer($window);

            handleScrollContainer = function(newContainer){

                if(!newContainer || newContainer.length === 0){
                    return false;
                }

                newContainer = angular.element(newContainer);
                if(newContainer){
                    return changeContainer(newContainer);
                }else{
                    throw new Exception('invalid scroll-container attribute.');
                }
            };

            scope.$watch('scrollContainer',handleScrollContainer);

            handleScrollContainer(scope.scrollContainer || []);

            return $timeout(function(){
                if(immediateCheck){
                    return handler();
                }
            },0);

        }
    }
 }]);


/* EMBS application filter section */
//filter for setSize loop
EMBS.filter('stepSize',function(){
    return function(data,value){
        if(!data)
            return;
        var newData = [];
        for(var i = 0; i < data.length; i+=value){
            newData.push(data[i]);   
        }
        return newData;
    }
})


/* EMBS common function section */
function GetRandomNum(Min,Max){ 

    var Range = Max - Min; 

    var Rand = Math.random(); 

    return(Min + Math.round(Rand * Range)); 

}