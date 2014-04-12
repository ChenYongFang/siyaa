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

	var defaultTpl = ''; // default template

	return{
		//open a modal
		open:function(tmpUrl,title,content,controller,resolve){
			$modal.open({
				templateUrl:tmpUrl,
				controller:controller,
				resolve:resolve;
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