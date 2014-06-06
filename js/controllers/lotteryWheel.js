/*
 * lottery wheel controller
 * autohr: Jeremy
 * date: 2014.04.16
 * Version: 1.0
 * License: siyaa inc
 */

define(['js/app'],function(app){

	app.register.controller('LotteryWheel',['$scope','ModalService',function($scope,ModalService){

	 	//canvas object
	 	var stage = new Kinetic.Stage({
	 		container:'wrap-wheel'
	 	});
	    stage.setListening(false);

	    var tween = null; //animate the start button obj
	    var unluckAngle = []; //unluck angule
	    var gifts = [{name:'美女一个',rate:1},{name:'Iphone5一台',rate:2},{name:'300元现金红包',rate:3},{name:'100淘积分',rate:4}];
	    $scope.gifts = gifts;

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
	        unluckAngle = drawPrize(gifts);
	 	};
	 	wheelBg.src = '/images/lottery/wheel-bg.jpg';
	    // draw arc prize shape
	    function drawPrize(gifts){

	        var unluckAngle = [];
	        var prizeCount = evalPrizeCount(gifts); // mixed prizes count.
	        var shapeAngle = 360 / prizeCount; // each arc shape size.
	        var startAngle = 90 % shapeAngle + shapeAngle / 2; //start wheel button angle
	        var prizes = mixPrizes(gifts);

	        //draw start button image
	        var startImg = new Image();
	        startImg.onload = function(){
	            var startLayer = new Kinetic.Layer();
	            var image = new Kinetic.Image({
	                x:maxStageXRadius + 4,
	                y:maxStageYRadius + 60,
	                width:132,
	                height:167,
	                image:startImg,
	                listening:true,
	                rotation:startAngle,
	                offset: {x:66, y:102}
	            });
	            startLayer.add(image);
	            stage.add(startLayer);

	            /* wheel the start button */
	            image.on('tap click',function(){

	            	var angle = unluckAngle[GetRandomNum(0,unluckAngle.length)] + 360 * 4;
	            	
	            	if(tween){
	            		tween.reset();
	            	}
	            	tween = new Kinetic.Tween({
	            		node:image,
	            		duration: 3,
	            		rotation:angle,
	            		onFinish:function(){
	            			ModalService.open({
	            				backdrop:'static',
	            				windowClass:'wheel-result modal-vm',
	            				templateUrl:'lottery-result.html',
	            				controller:['$scope','$modalInstance',function($scope,$modalInstance){
	            					$scope.msg = '很遗憾，您没有中奖在接再励哦！';
	            					$scope.close = $modalInstance.close;
	            				}]
	            			});
	            		},
	            		easing: Kinetic.Easings.StrongEaseOut
	            	});
	            	
	            	console.info(tween.play());
	            });
	        };
	        startImg.src = '/images/lottery/wheel-start.png';
	        
	        drawShape(prizes,LOTTERY.COLORS);
	        // draw prize shape to circle
	        function drawShape(prizes,colors){

	            var x = maxStageXRadius + 6;
	            var y = maxStageYRadius + 58;
	            var innerRadius = 238;
	            var shapeRadian = Math.PI / (prizeCount / 2);
	            var textRadius = x / 2 - 18;
	            var arcLayer = new Kinetic.Layer();

	            for(var i=0;i<prizes.length;i++){
	                var radian = shapeRadian * i;
	                var arc = new Kinetic.Arc({
	                    x: x,
	                    y: y,
	                    angle: shapeAngle,
	                    fill: colors[i],
	                    innerRadius: innerRadius,
	                    rotationDeg:shapeAngle * i
	                });
	                arcLayer.add(arc);

	                var funRadian = radian + shapeRadian / 2;

	                var textObj = prizes[i]; // draw text object
	                var drawCtx = [];

	                if(angular.isObject(textObj)){
	                	var text = new Kinetic.Text({
		                    fill:'#fff',
		                    fontSize: 60,
		                    fontStyle:'bold',
		                    text: textObj.rate,
		                    fontFamily: 'sans-serif',
		                    x: x + Math.cos(funRadian) * textRadius,
		                    y: y + Math.sin(funRadian) * textRadius,
		                    rotation:(funRadian + Math.PI / 2) / Math.PI * 180
		                });
		                text.offsetX(text.width()/2);
		                arcLayer.add(text);
		                text.offsetY(text.height());
		                var text = new Kinetic.Text({
		                    fill:'#fff',
		                    fontSize: 40,
		                    fontStyle:'bold',
		                    text: '等奖',
		                    fontFamily: 'sans-serif',
		                    x: x + Math.cos(funRadian) * textRadius,
		                    y: y + Math.sin(funRadian) * textRadius,
		                    rotation:(funRadian + Math.PI / 2) / Math.PI * 180
		                });
		                text.offsetX(text.width()/2);
		                arcLayer.add(text);
	                }else{
	                	//draw virtual prizes text
		                for(var j=0;j<textObj.length;j=j+2){
	                		var tmpText = textObj[j] + textObj[j+1];
	                		drawCtx.push(tmpText);
	                	}

		                for(var j=0;j<drawCtx.length;j++){
		                	var text = new Kinetic.Text({
			                    fill:'#fff',
			                    fontSize: 40,
			                    fontStyle:'bold',
			                    text: drawCtx[j],
			                    fontFamily: 'sans-serif',
			                    x: x + Math.cos(funRadian) * textRadius,
			                    y: y + Math.sin(funRadian) * textRadius,
			                    rotation:(funRadian + Math.PI / 2) / Math.PI * 180
			                });
			                text.offsetX(text.width()/2);
			                if(j%2 === 0){
			                	text.offsetY(text.height());
			                }
			                arcLayer.add(text);
		                }
	                }
	            }

	            stage.add(arcLayer);
	        }

	        function evalPrizeCount(gifts){
	            /* calculate prize count */
	            if(gifts.length < 4){
	                return 7;
	            }else if(gifts.length < 6){
	                return 8;
	            }else{
	                return 9; // max supported gift count to be display.
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
	                        //generate the unluck angle
	                        unluckAngle.push(shapeAngle * (jumpIndex + 2) + startAngle);
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
	                //generate the short prize unluck angle
	                unluckAngle.push(shapeAngle * (shortIndex + i + 2) + startAngle);
	            }

	            console.debug('prizes',prizes);
	            console.debug('unluck angle',unluckAngle);
	            return prizes;
	        }
	        return unluckAngle;
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
	}]);
});