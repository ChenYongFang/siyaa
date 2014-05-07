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
 	//$scope.menus = DataService.request('navigation/list4client',params,true);

 }])



 // define user module controller
 var UserModule = angular.module('userModule',[]);
 UserModule.controller('UserLogin',['$scope','ModalService','DataService',function($scope,ModalService,DataService){

 	$scope.login = function(){
 		DataService.post({url:'usermgr/user/mobile/login',data:{loginname:$scope.user.uname,password:$scope.user.upwd},callback:function(data){
 			
 		},errCollback:function(data,status){
 			ModalService.openWithDefaultTitle('登录失败，服务器发生异常!');
 		}});
 	}

 }]);



 //define market module controller
 var MarketModule = angular.module('marketModule',[]);
 MarketModule.controller('Market',['$scope','DataService','ModalService',function($scope,DataService,ModalService){

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

 		/*var dropBack = document.getElementById('drop-back');

 		var dropNavList = document.getElementById('drop-navlist');

 		if(!angular.element(dropBack).length){
 			angular.element(dropNavList).css('display','block');
 			angular.element(document).find('body').append('<div id="drop-back"><div>');
 		}else{
 			angular.element(dropNavList).css('display','none');
 			angular.element(dropBack).remove();
 		}*/
 	}
 }]);

 MarketModule.controller('MarketTypeGoods',['$scope','DataService','$stateParams',function($scope,DataService,$stateParams){

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




 // define lottery module controller
 var LotteryModule = angular.module('lotteryModule',[]);

 LotteryModule.controller('LotteryWheel',['$scope',function($scope){

 	$scope.loadResource = function(){

 		// draw prize used color
 		var colors = ['#cede01','#f7ed12','#f9b52c','#f39801','#dc1a22','#de0788',
 						'#b10279','#780c6f','#016dab','#008fc8','#439e35','#8fc320'];

 		var canvObj = document.getElementById('wheel');

 		var canvImgBg = document.getElementById('wheel-bg');

 		angular.element(canvImgBg).on('load',function(e){

 			canvObj.width = canvImgBg.offsetWidth;
 			canvObj.height = canvImgBg.offsetHeight;

 			//evaluate the prizes
 			var prizes = [];

 			drawPrize(colors);

 		});

 		var ctx = canvObj.getContext('2d');

 		//draw radian shape prize.
 		function drawPrize(colors,prizes){

 			//draw prize center point
 			var circleX = canvObj.width / 2 + canvObj.width * 0.009;
 			var circleY = canvObj.height / 2 + canvObj.height * 0.08;
 			var insideRadius = 10;
 			var outsideRadius = canvObj.width * 0.62 / 2;
 			var arc = Math.PI / 6;
 			var startAngle = 0;
 			//start draw each prize with diffrent color
 			for(var i=0;i<colors.length;i++){

 				ctx.fillStyle = colors[i];
 				ctx.beginPath();

 				var angle = startAngle + i * arc;
 				ctx.arc(circleX,circleY,outsideRadius,angle, angle + arc,false);
 				ctx.arc(circleX,circleY,insideRadius,angle + arc, angle,true);

 				ctx.fill();

 				//start to darw prize
 				ctx.save();
 				ctx.fillStyle = '#fff';


 			}

 		}

 		function drawImage(imagePath,x,y){
 			if(!x)
 				x = 0;
 			if(!y)
 				y = 0;
 			var img = new Image();
 			img.src = imagePath;

 			angular.element(img).on('load',function(e){
 				ctx.drawImage(img,x,y);
 			});

 		}

 	}

 }]);