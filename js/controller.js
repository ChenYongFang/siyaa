/*
 * embs application controller definition
 * autohr: Jeremy
 * date: 2014.04.16
 * Version: 1.0
 * License: siyaa inc
 */

  /* EMBS application common controller section */
 EMBS.controller('InitHomeNav',['$scope','DataService',function($scope,DataService){
    var params = {pagenum:1,pagesize:9,pid:''};
    DataService.get({url:'navigation/list4client',params:params,callback:function(data){
        $scope.menus = data.items;
    },cache:true});

 }])



 // define user modul controller
 var UserModule = angular.module('userModule',[]);
 UserModule.controller('UserLogin',['$scope','ModalService','DataService',function($scope,ModalService,DataService){

 	$scope.login = function(){
 		DataService.post({url:'usermgr/user/mobile/login',data:{loginname:$scope.user.uname,password:$scope.user.upwd},callback:function(data){
 			
 		},errCollback:function(data,status){
 			ModalService.openWithDefaultTitle('登录失败，服务器发生异常!');
 		}});
 	}

 }]);



 //define market modul controller
 var MarketModule = angular.module('marketModule',[]);
 MarketModule.controller('Market',['$scope','DataService',function($scope,DataService){
 	$scope.types = [];
 	$scope.types[0] = {id:1,name:'啤酒饮料'};
 	$scope.types[1] = {id:2,name:'风味小吃'};
 	$scope.types[2] = {id:3,name:'时令水果'};
 	$scope.types[3] = {id:4,name:'棋牌道具'};
 	$scope.types[4] = {id:5,name:'特色服务'};

 	//header's drop modal
 	$scope.dropNav = function(){

 		var dropBack = document.getElementById('drop-back');

 		var dropNavList = document.getElementById('drop-navlist');

 		if(!angular.element(dropBack).length){
 			angular.element(dropNavList).css('display','block');
 			angular.element(document).find('body').append('<div id="drop-back"><div>');
 		}else{
 			angular.element(dropNavList).css('display','none');
 			angular.element(dropBack).remove();
 		}
 	}
 }]);

 MarketModule.controller('MarketTypeGoods',['$scope','DataService','$stateParams',function($scope,DataService,$stateParams){

 	pageTypeGoods();

 	$scope.moreTypeGoods = function(){
 		//alert('true');
 	}

 	function pageTypeGoods(){
 		DataService.get({url:'market/goods/query',params:
 		{
 			pagesize:2,pagenum:1,search:'',tid:$stateParams.tid,ordertype:0
 		},callback:function(data){
 			if($scope.typeGoods)
 				data.items = data.items.concat($scope.typeGoods.items);
 			$scope.typeGoods = data;
 		}});
 	}

 }])