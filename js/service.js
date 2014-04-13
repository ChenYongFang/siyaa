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

	return{
		// open a modal.
		open:function(title,content){
			show({
				controller:function($scope,$modalInstance){
					$scope.title = title;
					$scope.content = content;
					$scope.close = function(){
						$modalInstance.close();
					}
				}
			});
		}
	}
}]);

//basic data service

 EMBS.factory('DataService',['$http',function($http){

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
 		//处理远程请求方法
 		get:function(url, params, callback,errCollback){
 			$http.get(baseDataUrl+url,{params:params}).success(function(data){
 				preCallback(data,callback);
 			}).error(function(data,status){
 				preCallback(data,callback,status,errCollback);
 			});
 		},
 		post:function(url,data,callback,errCollback){
 			$http.post(baseDataUrl+url,$.param(data)).success(function(data){
 				preCallback(data,collback);
 			}).error(function(data,status){
 				preCallback(data,callback,status,errCollback);
 			});
 		}
 	}

 }]);