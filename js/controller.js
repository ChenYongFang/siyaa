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
 }]);
 //ApplicationController is a container for a lot of global application logic, and an alternative to Angular’s run function.
 EMBS.controller('ApplicationController',['$scope','USER_ROLES','AuthService',function($scope,USER_ROLES,AuthService){

 	$scope.currentUser = null;
 	$scope.userRoles = USER_ROLES;
 	$scope.isAuthorized = AuthService.isAuthorized;

 }]);


 //define market module controller
 var MarketModule = angular.module('marketModule',[]);
 MarketModule.controller('MarketController',['$scope','DataService','ModalService',function($scope,DataService,ModalService){

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

 	//canvas object
 	var stage = new Kinetic.Stage({
 		container:'wrap-wheel'
 	});
 	var containerObj = document.getElementById('wrap-wheel');
 	var maxStageWidth = 770;
	var maxStageHeight = 735;
    var maxStageXRadius = Math.round(maxStageWidth / 2);
    var maxStageYRadius = Math.round(maxStageHeight / 2);

 	var wheelBg = new Image();
 	wheelBg.onload = function(){

        var bgLayer = new Kinetic.Layer();
 		resizeStage(containerObj);
 		var image = new Kinetic.Image({
 			width:maxStageWidth,
 			height:maxStageHeight,
 			image:wheelBg
 		});
 		bgLayer.add(image);
        stage.add(bgLayer);
        //draw prize shape.
        drawPrize();

        //draw start button image
        var startImg = new Image();
        startImg.src = '/images/lottery/wheel-start.png';
        startImg.onload = function(){
            var startLayer = new Kinetic.Layer();
            var image = new Kinetic.Image({
                x:maxStageXRadius - 62,
                y:maxStageYRadius - 40,
                width:132,
                height:167,
                image:startImg
            });
            startLayer.add(image);
            stage.add(startLayer);
        };

 	};
 	wheelBg.src = '/images/lottery/wheel-bg.jpg';
    // draw arc prize shape
    function drawPrize(gifts){

        gifts = ['美女','香蕉','苹果'];
        var prizeCount = evalPrizeCount(gifts); // mixed prizes count.
        var shapeAngle = 360 / prizeCount; // each arc shape size.
        var prizes = mixPrizes(gifts);
        
        drawShape(prizes,LOTTERY.COLORS);
        // draw prize shape to circle
        function drawShape(prizes,colors){

            var x = maxStageXRadius + 6;
            var y = maxStageYRadius + 58;
            var innerRadius = 238;
            //var shapeRadian = Math.PI / (prizeCount / 2);
            var arcLayer = new Kinetic.Layer();

            for(var i=0;i<prizes.length;i++){
                var arc = new Kinetic.Arc({
                    x:x,
                    y:y,
                    angle: shapeAngle,
                    fill: colors[i],
                    innerRadius: innerRadius,
                    rotationDeg:shapeAngle * i
                });
               /* var text = new Kinetic.Text({
                    fill:'#fff',
                    x: x,
                    y: y,
                    text: prizes[i],
                    fontSize: 42,
                    fontStyle:'bold',
                    fontFamily: 'sans-serif',
                });*/
                arcLayer.add(arc);
            }

            stage.add(arcLayer);
        }

        function evalPrizeCount(gifts){
            /* calculate prize count */
            if(gifts.length < 4){
                return 8;
            }else if(gifts.length < 6){
                return 10;
            }else{
                return 12; // max supported gift count to be display.
            }
        }

        // mix the gifts and virtual prizes
        function mixPrizes(gifts){

            var prizes = new Array();
            var virtualPrizes = LOTTERY.VIRTUALPRIZES;
            var distance = Math.floor((prizeCount - gifts.length) / gifts.length);

            for(var i=0;i<gifts.length;i++){
                //after add virtual prizes jump to second prize
                jumpIndex = i * distance + i;
                prizes[jumpIndex] = gifts[i];
                prizes[jumpIndex].angle = shapeAngle * (i + 2) + Math.floor(shapeAngle / 2);

                if(distance !== 0){
                    var tmpPrizes = getRandomVirtualPrizes(distance);
                    for(var j=0;j<tmpPrizes.length;j++){
                        prizes[++jumpIndex] = tmpPrizes[j];
                    }
                }
            }
            function getRandomVirtualPrizes(size){
                var tmpPrizes = new Array(size);
                for(var i=0;i<tmpPrizes.length;i++){
                    tmpPrizes[i] = virtualPrizes[GetRandomNum(0,virtualPrizes.length - 1)];
                }
                return tmpPrizes;
            }
            /* add random virtual prize to short prizes  */
            var shortPrizeCount = prizeCount - prizes.length;
            var shortIndex = prizes.length;
            for(var i=0;i<shortPrizeCount;i++){
                prizes[shortIndex + i] = virtualPrizes[GetRandomNum(0,virtualPrizes.length - 1)];
            }

            //console.debug('prizes',prizes);
            return prizes;
        }
    }

 	// Sets scale and dimensions of stage in relation to window size
 	function resizeStage(containerObj){

 		var scalePercentage = angular.element(containerObj).width() / maxStageWidth;

 		stage.setAttr('scaleX', scalePercentage);
    	stage.setAttr('scaleY', scalePercentage);
    	stage.setAttr('width', maxStageWidth * scalePercentage);
    	stage.setAttr('height', maxStageHeight * scalePercentage);
    	stage.draw();

 	}

 	// On window resize we resize the stage size
	window.addEventListener('resize', function(){
		resizeStage(containerObj);
	});

 	//strat to roll wheel
 	/*$scope.startWheel = function(e){

 		angular.element(e.target).addClass('active');
 		console.info(e);
 	}

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
 			var gifts = [{id:1,name:'美女',rate:1},{id:2,name:'香蕉',rate:2},{id:3,name:'苹果',rate:3}];


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
 			var textRadius = circleX / 2 - 6;
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
 				ctx.font='normal normal bold 14px sans-serif';

 				var text = prizes[i];

 				ctx.translate(circleX + Math.cos(angle + arc / 2) * textRadius, circleY + Math.sin(angle + arc / 2) * textRadius);
 				ctx.rotate(angle + arc / 2 + Math.PI / 2);

 				if(angular.isObject(text)){

 					ctx.font='25px normal';
 					ctx.fillText(text.rate,-ctx.measureText(text.rate).width / 2, 0);
 					ctx.translate(0, 15);
 					ctx.font='14px normal';
 					ctx.fillText('等奖',-ctx.measureText('等奖').width / 2, 0);
 					ctx.restore();
 					continue;
 				}

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

 				if(gifts.length > 11)
 					return gifts;

 				var virtualPrizes = ['在接再励','祝你好运','恭喜发财','加油','在转一次','谢谢参与'];

 				var prizesLength = size * 2;
 				var prizes = new Array();
 				
 				var distance = Math.floor((prizesLength - gifts.length) / gifts.length);

 				for(var i=0;i<gifts.length;i++){

 					//after add virtual prizes jump to second prize
 					jumpIndex = i * distance + i;
 					prizes[jumpIndex] = gifts[i];
 					prizes[jumpIndex].angle = getShapeAngle(size) * (i + 2) + Math.floor(getShapeAngle(size) / 2);

 					var tmpPrizes = getRandomVirtualPrizes(virtualPrizes,distance);
 					for(var j=0;j<tmpPrizes.length;j++){
 						prizes[++jumpIndex] = tmpPrizes[j];
 					}

 				}

 				function getShapeAngle(size){

 					var angle = 0;

 					switch(size){
 						case 4:
 							angle = 45;
 							break 
 						case 5:
 							angle = 36;
 							break;
 						case 6:
 							angle = 30;
 							break;
 					}

 					return angle;

 				}

 				function getRandomVirtualPrizes(virtualPrizes,size){

 					var tmpPrizes = new Array(size);
 					for(var i=0;i<tmpPrizes.length;i++){
 						tmpPrizes[i] = virtualPrizes[GetRandomNum(0,virtualPrizes.length - 1)];
 					}
 					return tmpPrizes;

 				}

 				var restLoopCount = prizesLength - prizes.length;
 				var restIndex = prizes.length;
 				for(var i=0;i<restLoopCount;i++){
 					prizes[restIndex + i] = virtualPrizes[GetRandomNum(0,virtualPrizes.length - 1)];
 				}

 				console.debug('prizes',prizes);

 				return prizes;

 			}

 			function calculateRadianSize(gifts){
 				//generate eight arc shape
 				if(gifts.length < 4)
 					return 4;
 				//generate ten arc shape
 				else if(gifts.length < 6)
 					return 5;
 				//generate twelve arc shape
 				else
 					return 6;
 			}

 		}
 	}*/
 }]);