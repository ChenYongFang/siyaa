/*
 * market type goods controller
 * autohr: Jeremy
 * date: 2014.05.27
 * Version: 1.0
 * License: siyaa inc
 */

 define(['js/app'],function(app){

 	app.register.controller('MarketTypeGoods',['$scope','DataService','$stateParams',function($scope,DataService,$stateParams){

	 	$scope.pagenum = 1;
	 	pageTypeGoods();

	 	$scope.moreTypeGoods = function(){
	 		
	 		if($scope.typeGoods && $scope.typeGoods.totalpage > $scope.pagenum){
	 			$scope.pagenum ++;
	 			pageTypeGoods();
	 		}
	 	}

	 	function pageTypeGoods(){
	 		DataService.get({url:'market/goods/query',params:
	 		{
	 			pagesize:2,pagenum:$scope.pagenum,search:'',tid:$stateParams.tid,ordertype:0
	 		},callback:function(data){
	 			if($scope.typeGoods)
	 				data.items = data.items.concat($scope.typeGoods.items);
	 			$scope.typeGoods = data;
	 		}});
	 	}
	}])
 });