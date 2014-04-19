/*
 * common angularjs service
 * autohr: Jeremy
 * date: 2014.04.16
 * defined basic service for the application
 * Version: 1.0
 * License: siyaa inc
 */

//web modal service

EMBS.factory('ModalService',['$modal','$log',function($modal,$log){
	//show a modal
	function show(obj){

		// default template
		var defaultTpl = '';

		if(obj.tmpUrl){
			// set templateUrl
			defaultTpl = obj.tmpUrl;
		}else if(obj.template){
			//inline template 
			$modal.open({
				template:obj.template,
				controller:obj.controller,
				resolve:obj.resolve
			});
			//jump out of here
			return true;
		}else{
			// set template to be default.
			defaultTpl = '/views/angularui/modal/modal.htm';
		}

		//tmpUrl,title,content,controller,resolve
		$modal.open({
			templateUrl:defaultTpl,
			controller:obj.controller,
			resolve:obj.resolve
		});
	}

	// close a modal
	function close($modalInstance){
		$modalInstance.close();
	}

	return{
		// open a modal.
		open:function(title,content){
			show({
				controller:function($scope,$modalInstance){
					$scope.title = title;
					$scope.content = content;
					$scope.close = function(){
						close($modalInstance);
					}
				}
			});
		},
		// open a modal with default title
		openWithDefaultTitle:function(content){
			show({
				controller:function($scope,$modalInstance){
					$scope.title = '温馨提示';
					$scope.content = content;
					$scope.close = function(){
						close($modalInstance);
					}
				}
			});
		}
	}
}]);

//basic data service

 EMBS.factory('DataService',['$http','$log','ModalService',function($http,$log,ModalService){

 	var baseDataUrl = '/embs/';

 	function preCallback(data,callback,status,errCollback){
 		if(errCollback && typeof(errCollback) == "function"){

 			//Http请求异常处理
 			errCollback(data,status);

 		}else{
 
 			if(data._code){
 				//包含数据接口返回的状态
 				switch(data._code){
 					//异常代码判断
 					case 10:
 					case 100:
 						ModalService.openWithDefaultTitle(ERRCODEMSG[data._code]);
 						break;
 					default:
 						callback(data); //正常数据请求
 						break;
 				}
 			}else{
 				callback(data); //正常数据请求
 			}
 		}
 	}

 	return {
 		//处理远程请求方法 url, params, callback,errCollback,cache
 		get:function(options){
 			// default to be no cache
 			if(!options.cache)
 				options.cache = false;
 			$http.get(baseDataUrl+options.url,{params:options.params,cache:options.cache}).success(function(data){
 				preCallback(data,options.callback);
 			}).error(function(data,status){
 				$log.info('GetHttpError：'+status+'  Params:'+params);
 				preCallback(data,options.callback,status,options.errCollback);
 			});
 		},
 		post:function(options){
 			/* replace the angularjs's default post behavior to not be normal form post behavior */
 			$http.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'};

 			$http.post(baseDataUrl+options.url,angular.params(options.data)).success(function(data){
 				preCallback(data,options.callback);
 			}).error(function(data,status){
 				$log.info('PostHttpError：'+status+'  Params:'+options.params);
 				preCallback(data,options.callback,status,options.errCollback);
 			});
 		},
 		postJson:function(options){
 			$http.post(baseDataUrl+options.url,angular.params(options.data)).success(function(data){
 				preCallback(data,options.callback);
 			}).error(function(data,status){
 				$log.info('PostJsonHttpError：'+status+'  Params:'+options.params);
 				preCallback(data,options.callback,status,options.errCollback);
 			});
 		}
 	}

 }]);