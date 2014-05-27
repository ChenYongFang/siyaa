/*
 * angular-embs Application module
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application definition
 * Version: 1.0
 * License: siyaa inc
 */

 define([],function(){

    var APP = angular.module('app',['ui.router','ui.bootstrap','ngTouch']);

    APP.config(['$stateProvider','$urlRouterProvider','$httpProvider','$controllerProvider','$compileProvider','$filterProvider','$provide',

        function($stateProvider,$urlRouterProvider,$httpProvider,$controllerProvider,$compileProvider,$filterProvider,$provide){

         	/* laze load refernce */
            APP.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            var ctrlDir = 'js/controllers/';

            function generateDeps($q,$rootScope,dependencies){

                if(!angular.isArray(dependencies))
                    dependencies = [dependencies];

                var deferred = $q.defer();
                require(dependencies,function(){
                    // all dependencies have now been loaded by requirejs so resolve the promise
                    $rootScope.$apply(function(){
                        deferred.resolve();
                    });
                });
                return deferred.promise;
            }

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
         				css:'/css/user/user.css'
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
         			/*controller:'LoginController',*/
         			templateUrl:'views/partials/u-login.html'
         		}
         	)
         	.state(
         		'user.myrecom',
         		{
         			url:'/myrecom',
         			title:'-我的推荐人',
         			css:'/css/user/myrecom.css',
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
                    resolve:{
                        deps:function($q,$rootScope){
                            return generateDeps($q,$rootScope,ctrlDir + 'questionnaire');
                        }
                    },
            		controller:'QuestionnaireController',
            		templateUrl:'views/questionnaire/home.html'
            	}
            )
            .state(
            	'questionnaire.details',
            	{
            		url:'/details/:qid',
            		title:'-详细页',
                    resolve:{
                        deps:function($q,$rootScope){
                            return generateDeps($q,$rootScope,ctrlDir + 'questionnaireDetails');
                        }
                    },
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
            			css:'/css/market/market.css'
            		},
                    resolve:{
                        deps:function($q,$rootScope){
                            return generateDeps($q,$rootScope,ctrlDir + 'market');
                        }
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
            		css:'/css/market/type-goods.css',
                    resolve:{
                        deps:function($q,$rootScope){
                            return generateDeps($q,$rootScope,ctrlDir + 'marketTypeGoods');
                        }
                    },
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
            			css:'/css/market/order.css'
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
                    	css:'/css/lottery/lottery-red.css'
                    },
                    resolve:{
                        deps:function($q,$rootScope){
                            return generateDeps($q,$rootScope,'lib/kinetic');
                        }
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
                    css:'/css/lottery/lottery-wheel.css',
                    controller:'LotteryWheel',
                    resolve:{
                        deps:function($q,$rootScope){
                            return generateDeps($q,$rootScope,['js/controllers/lotteryWheel']);
                        }
                    },
                    templateUrl:'views/partials/lottery-wheel.html'
                }
            );
            //set default http header application/x-www-form-urlencoded
            //$httpProvider.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'};
            //the login response interceptor
            /*$httpProvider.interceptors.push(['injector',function($injector){
                return $injector.get('AuthInterceptor');
            }]);*/
        }
    ]);

    APP.run(['$rootScope','AUTH_EVENTS','AuthService',function($rootScope,AUTH_EVENTS,AuthService){

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
    return APP;
});