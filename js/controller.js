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
 			var gifts = ['苹果','香蕉','美女'];


 			drawPrize(colors,gifts);

 		});

 		var ctx = canvObj.getContext('2d');

 		//draw radian shape prize.
 		function drawPrize(colors,gifts){

 			//draw prize center point
 			var circleX = canvObj.width / 2 + canvObj.width * 0.009;
 			var circleY = canvObj.height / 2 + canvObj.height * 0.08;
 			var insideRadius = 10;
 			var outsideRadius = canvObj.width * 0.62 / 2;
 			var shapeSize = calculateRadianSize(gifts);
 			var arc = Math.PI / shapeSize;
 			var startAngle = 0;
 			var textRadius = circleX / 2 - 4;
 			var prizes = getShpaePrizes(gifts,shapeSize);
 			//start draw each prize with diffrent color
 			for(var i=0;i<prizes.length;i++){

 				ctx.fillStyle = colors[i];
 				ctx.beginPath();

 				var angle = startAngle + i * arc;
 				ctx.arc(circleX,circleY,outsideRadius,angle, angle + arc,false);
 				ctx.arc(circleX,circleY,insideRadius,angle + arc, angle,true);
 				ctx.fill();

 				//start to darw prize
 				ctx.save();
 				ctx.fillStyle = '#fff';
 				ctx.font="normal normal bold 14px sans-serif";

 				var text = prizes[i];

 				ctx.translate(circleX + Math.cos(angle + arc / 2) * textRadius, circleY + Math.sin(angle + arc / 2) * textRadius);
 				ctx.rotate(angle + arc / 2 + Math.PI / 2);

 				if(text.length > 3){
 					var tmpStr = text[0] + text[1];
 					ctx.fillText(tmpStr, -ctx.measureText(tmpStr).width / 2, 0);
 					tmpStr = text[2] + text[3];
 					ctx.translate(0, 15);
 					ctx.fillText(tmpStr, -ctx.measureText(tmpStr).width / 2, 0);
 				}else{
 					ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
 				}

        		ctx.restore();

 			}

 			//generate full arc shape prize with gifts and other text
 			function getShpaePrizes(gifts,size){

 				if(gifts > 11)
 					return gifts;

 				var virtualPrizes = ['在接再励','祝你好运','恭喜发财','加油','在转一次'];

 				var prizes = new Array(size * 2);
 				
 				var distance = Math.floor((prizes.length - gifts.length) / 2);

 				for(var i=0;i<gifts.length;i++){

 					//after add virtual prizes jump to second prize
 					jumpIndex = i * distance;
 					prizes[jumpIndex] = gifts[i];
 					var tmpPrizes = getRandomVirtualPrizes(virtualPrizes,distance);
 					for(var j=0;j<tmpPrizes.length;j++){
 						prizes[++jumpIndex] = tmpPrizes[j];
 					}

 				}

 				function getRandomVirtualPrizes(virtualPrizes,size){

 					var tmpPrizes = new Array(size);
 					for(var i=0;i<tmpPrizes.length;i++){
 						tmpPrizes[i] = virtualPrizes[GetRandomNum(0,virtualPrizes.length - 1)];
 					}
 					return tmpPrizes;

 				}

 				if(!prizes[prizes.length - 1])
 					prizes[prizes.length - 1] = virtualPrizes[GetRandomNum(0,virtualPrizes.length - 1)];

 				console.debug('prizes',prizes);

 				return prizes;

 			}

 			function calculateRadianSize(gifts){
 				//generate eight arc shape
 				if(gifts.length < 3)
 					return 4;
 				//generate ten arc shape
 				else if(gifts.length <5)
 					return 5;
 				//generate twelve arc shape
 				else
 					return 6;
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