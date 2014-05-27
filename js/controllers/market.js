/*
 * market controller
 * autohr: Jeremy
 * date: 2014.05.27
 * Version: 1.0
 * License: siyaa inc
 */

 define(['js/app'],function(app){

	app.register.controller('MarketController',['$scope','DataService','ModalService',function($scope,DataService,ModalService){
	 	//header's drop modal
	 	$scope.dropNav = function(){

	 		ModalService.show({templateUrl:'marketDropMenu.html',controller:['$scope','DataService',function($scope,DataService){

	 			DataService.get({url:'market/goods/type/list',callback:function(data){
	 			//$scope.types = data;

	 			$scope.types = [];
	 			$scope.types[0] = {id:1,name:'啤酒饮料'};
	 			$scope.types[1] = {id:2,name:'风味小吃'};
	 			$scope.types[2] = {id:3,name:'时令水果'};
	 			$scope.types[3] = {id:4,name:'棋牌道具'};
	 			$scope.types[4] = {id:5,name:'特色服务'};

	 			}});
	 		}]});
	 	}
	}]);
 });