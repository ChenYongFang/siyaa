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
	DataService.get({url:'navigation/list4client',params:params,callback:function(data){
		$scope.menus = data.items;
	},cache:true});
 }])

 // define user modul controller
 EMBS.controller('UserLogin',['$scope','ModalService','DataService',function($scope,ModalService,DataService){

 	$scope.login = function(){
 		DataService.post({url:'usermgr/user/mobile/login',data:{loginname:$scope.user.uname,password:$scope.user.upwd},callback:function(data){
 			
 		},errCollback:function(data,status){
 			ModalService.openWithDefaultTitle('登录失败，服务器发生异常!');
 		}});
 	}

 }]);



 //define market modul controller
 EMBS.controller('Market',['$scope','DataService',function($scope,DataService){
 	$scope.types = [];
 	$scope.types[0] = {id:1,name:'啤酒饮料'};
 	$scope.types[1] = {id:2,name:'风味小吃'};
 	$scope.types[2] = {id:3,name:'时令水果'};
 	$scope.types[3] = {id:4,name:'棋牌道具'};
 	$scope.types[4] = {id:5,name:'特色服务'};
 	console.info('listType',$scope.types)

 	//header's drop modal
 	$scope.dropNav = function(){
 		if(!angular.element('#drop-back').length){
 			angular.element('#drop-navlist').css('display','block');
 			angular.element('body').append('<div id="drop-back"><div>');
 		}else{
 			angular.element('#drop-navlist').css('display','none');
 			angular.element('#drop-back').remove();
 		}
 	}
 }]);

 EMBS.controller('MarketHome',['$scope','DataService',function($scope,DataService){
 	$scope.typeProducts = {
 		totalitem:20,
 		totalpage:10,
 		types:
 		[
 			{
 				name:'啤酒饮料',
 				items:[
 					{
 						name:'法国科翠思啤酒',
 						image:'images/test/01.jpg',
 						saleprice:236.00
 					},
 					{
 						name:'雪花啤酒',
 						image:'images/test/01.jpg',
 						saleprice:5.00
 					},
 					{
 						name:'金威啤酒',
 						image:'images/test/01.jpg',
 						saleprice:10.00
 					},
 					{
 						name:'纯生啤酒',
 						image:'images/test/01.jpg',
 						saleprice:5.00
 					}
 				]
 			},
 			{
 				name:'风味小吃',
 				items:[
 					{
 						name:'白记牛肉水饺|火锅白肉水饺',
 						image:'images/test/01.jpg',
 						saleprice:236.00
 					},
 					{
 						name:'火腿萝卜丝酥饼|油炸糖糕',
 						image:'images/test/01.jpg',
 						saleprice:48.00
 					},
 					{
 						name:'小绍兴鸡粥|虾仁汤年糕',
 						image:'images/test/01.jpg',
 						saleprice:1000.00
 					},
 					{
 						name:'食物营养介绍--稻米',
 						image:'images/test/01.jpg',
 						saleprice:50.00
 					}
 				]
 			}
 		]
 	}
 }])