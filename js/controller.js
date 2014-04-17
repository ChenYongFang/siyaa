/*
 * angular-embs Application's controller
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application controller definition
 * Version: 1.0
 * License: siyaa inc
 */

 // defin layout template controller
 EMBS.controller('InitHomeNav',['$scope','DataService',function($scope,DataService){
 	var params = {pagenum:1,pagesize:9,pid:''};
	DataService.get('navigation/list4client',params,function(data){
		$scope.menus = data.items;
	});
 }])

 // define user modul controller
 EMBS.controller('UserLogin',['$scope','ModalService','DataService',function($scope,ModalService,DataService){

 	$scope.login = function(){
 		DataService.post('usermgr/user/mobile/login',{loginname:$scope.user.uname,password:$scope.user.upwd},function(data){
 			
 		},function(data,status){
 			ModalService.openWithDefaultTitle('登录失败，服务器发生异常!');
 		});
 	}

 }]);