/*
 * application's common directives
 * autohr: Jeremy
 * date: 2014.04.16
 * Version: 1.0
 * License: siyaa inc
 */

 define(['js/app'],function(app){
	 //compile the head with extra things such like stylesheet、title etc. 
	 app.directive('head', ['$rootScope','$compile',
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
 });