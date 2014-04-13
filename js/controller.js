/*
 * angular-embs Application's controller
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application controller definition
 * Version: 1.0
 * License: siyaa inc
 */

 // define user modul controller
 EMBS.controller('UserLogin',['$scope','ModalService',function($scope,ModalService){

 	$scope.login = function(){
 		ModalService.openWithDefaultTitle('登录失败，暂时无法获取服务器数据！');
 	}

 }]);