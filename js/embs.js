/*
 * angular-embs Application module
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application definition
 * Version: 1.0
 * License: siyaa inc
 */
 var EMBS = angular.module('embs',['ui.router','ui.bootstrap','userModule','marketModule','lotteryModule','questionnaireModule']);

EMBS.run(['$rootScope','AUTH_EVENTS','AuthService',function($rootScope,AUTH_EVENTS,AuthService){

    $rootScope.$on('$stateChangeStart',function(event, next){
        /*var authorizedRoles = next.data.authorizedRoles;
        if(!AuthService.isAuthorized(authorizedRoles)){
            event.preventDefault();
            if(AuthService.isAuthenticated()){
                //user is not allow.
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }else{
                //user is not logged in.
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
        }*/

        //is show template global navigation
        $rootScope.showGlobalNav = true; //default to be display
        if(angular.isDefined(next.showGlobalNav)){
            $rootScope.showGlobalNav = next.showGlobalNav;
        }else if(angular.isDefined(next.data.showGlobalNav)){
            $rootScope.showGlobalNav = next.data.showGlobalNav;
        }

    });

}]);

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
            showGlobalNav:false,
            controller:'LoginController',
            templateUrl:'views/partials/u-login.html'
        }
    )
    .state(
        'user.myrecom',
        {
            url:'/myrecom',
            title:'-我的推荐人',
            css:'/css/myrecom.css',
            showGlobalNav:true,
            templateUrl:'views/partials/u-myrecom.html'
        }
    )



    //register questionnaire route
    .state(
        'questionnaire',
        {
            abstract:true,
            url:'/questionnaire',
            data:
            {
                title:'问卷调查',
                showGlobalNav:false,
                css:'/css/questionnaire/questionnaire.css'
            },
            templateUrl:'views/questionnaire/questionnaire.html'
        }
    )
    .state(
        'questionnaire.home',
        {
            url:'/home',
            title:'-首页',
            controller:'QuestionnaireController',
            templateUrl:'views/questionnaire/home.html'
        }
    )
    .state(
        'questionnaire.details',
        {
            url:'/details/:qid',
            title:'-详细页',
            controller:'QuestionnaireDetailsController',
            templateUrl:'views/questionnaire/details.html'
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
                showGlobalNav:false,
                css:'/css/market.css'
            },
            controller:'MarketController',
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
                showGlobalNav:false,
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
    //the login response interceptor
    /*$httpProvider.interceptors.push(['injector',function($injector){
        return $injector.get('AuthInterceptor');
    }]);*/

}]);

/*********** EMBS application directive section ***********/
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

/*********** EMBS application filter section ***********/
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
});

/*********** EMBS common function section ***********/
angular.element.prototype.width = function(){
    if(this.length === 0)
        return false;

    var computedStyle = window.getComputedStyle(this[0]);
    var value = parseFloat(computedStyle.width) - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
    return value;
};
angular.element.prototype.height = function(){
    if(this.length === 0)
        return false;

    var computedStyle = window.getComputedStyle(this[0]);
    var value = parseFloat(computedStyle.height) - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
    return value;
};

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

function GetRandomNum(Min,Max){ 

    var range = Max - Min; 

    var rand = Math.random();

    return(Min + Math.round(rand * range)); 

}