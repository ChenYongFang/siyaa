/*
 * lottery wheel controller
 * autohr: Jeremy
 * date: 2014.04.16
 * Version: 1.0
 * License: siyaa inc
 */

define(['js/app'],function(app){

	app.register.controller('LotteryWheel',['$scope',function($scope){

	 	//canvas object
	 	var stage = new Kinetic.Stage({
	 		container:'wrap-wheel'
	 	});
	    stage.setListening(false);

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
	        startImg.src = '/images/lottery/wheel-start.png';

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
	            var shapeRadian = Math.PI / (prizeCount / 2);
	            var textRadius = x / 2 - 6;
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
	                var funRadian = radian + shapeRadian / 2;
	                var text = new Kinetic.Text({
	                    fill:'#fff',
	                    x: x + Math.cos(funRadian) * textRadius,
	                    y: y + Math.sin(funRadian) * textRadius,
	                    text: prizes[i],
	                    fontSize: 42,
	                    fontStyle:'bold',
	                    rotation:(funRadian + Math.PI / 2) / Math.PI * 180,
	                    fontFamily: 'sans-serif',
	                });
	                arcLayer.add(arc);
	                arcLayer.add(text);
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
	}]);
});