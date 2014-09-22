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
        var bgLayer = new Kinetic.Layer();
        var wheelLayer = new Kinetic.Layer();
	 	var stage = new Kinetic.Stage({
	 		container:'wrap-wheel'
	 	});
	    stage.setListening(false);

	    var tween = null; //animate the start button obj
	    var unluckAngle = []; //unluck angule
	    var gifts = [{name:'美女一个',rate:1},{name:'Iphone5一台',rate:2},{name:'300元现金红包',rate:3}];
	    $scope.gifts = gifts;

	 	var containerObj = document.getElementById('wrap-wheel');
	 	var maxStageWidth = 800;
		var maxStageHeight = 765;
	    var maxStageXRadius = Math.round(maxStageWidth / 2);
	    var maxStageYRadius = Math.round(maxStageHeight / 2);

        // draw wheel background image.
        loadImage('/images/lottery/wheel-bg.jpg',function(rawImage){
            var image = new Kinetic.Image({
                image:rawImage,
                width:maxStageWidth,
                height:maxStageHeight
            });
            bgLayer.add(image);
            stage.add(bgLayer);
            //draw prize shape.
            drawPrizeShape(gifts);
        });
	    // draw arc prize shape
	    function drawPrizeShape(gifts){
	        var prizeCount = evalPrizeCount(gifts); // mixed prizes count.
	        var shapeAngle = 360 / prizeCount; // each arc shape size.
	        var startAngle = 90 - (90 % shapeAngle); //start wheel button angle
	        var prizes = mixPrizes(gifts);
            var centraPoint = {
                x:maxStageXRadius - 1,
                y:maxStageYRadius + 62
            }
            var prizeShapeGroup = new Kinetic.Group({
                x:centraPoint.x,
                y:centraPoint.y,
                offset:{x:centraPoint.x ,y:centraPoint.y}
            });

            //draw wrap prize circle image
            loadImage('/images/lottery/wrap-circle.png',function(rawImage){
                var image = new Kinetic.Image({
                    x:82,
                    y:128,
                    width:634,
                    height:634,
                    image:rawImage
                });
                prizeShapeGroup.add(image);
                wheelLayer.add(prizeShapeGroup);
                drawShape(prizes,LOTTERY.COLORS);
                resizeStage(containerObj);
                //draw start button image
                loadImage('/images/lottery/wheel-start.png',function(rawImage){
                    var image = new Kinetic.Image({
                        x:centraPoint.x,
                        y:centraPoint.y,
                        width:132,
                        height:167,
                        image:rawImage,
                        listening:true,
                        //rotation:startAngle,
                        offset: {x:66, y:102}
                    });
                    wheelLayer.add(image);
                    stage.add(wheelLayer);
                    var isWheeling = false;
                    /* wheel the start button */
                    image.on('tap click',function(){
                        if(isWheeling){
                            return false;
                        }
                        var angle = unluckAngle[GetRandomNum(0,unluckAngle.length)] + 360 * 4;
                        if(tween){
                            tween.reset();
                            prizeShapeGroup.draw();
                        }
                        tween = new Kinetic.Tween({
                            node:prizeShapeGroup,
                            duration: 4,
                            rotation:angle,
                            onFinish:function(){
                                ModalService.open({
                                    backdrop:'static',
                                    windowClass:'wheel-result modal-vm',
                                    templateUrl:'lottery-result.html',
                                    controller:['$scope','$modalInstance',function($scope,$modalInstance){
                                        $scope.msg = '很遗憾，您没有中奖在接再励哦！';
                                        $scope.close = function(){
                                            $modalInstance.close();
                                            isWheeling = false;
                                        }
                                    }]
                                });
                            },
                            easing: Kinetic.Easings.EaseOut
                        });
                        isWheeling = true;
                        tween.play();
                    });
                });
            });

	        // draw prize shape to circle
	        function drawShape(prizes,colors){
	            var innerRadius = 250;
	            var shapeRadian = Math.PI / (prizeCount / 2);
	            var textRadius = centraPoint.x / 2 - 18;

	            for(var i=0;i<prizes.length;i++){
	                var radian = shapeRadian * i;
	                var arc = new Kinetic.Arc({
	                    x: centraPoint.x,
	                    y: centraPoint.y,
	                    angle: shapeAngle,
	                    fill: colors[i],
	                    innerRadius: innerRadius,
	                    rotationDeg:shapeAngle * i
	                });
                    prizeShapeGroup.add(arc);

	                var funRadian = radian + shapeRadian / 2;

	                var textObj = prizes[i]; // draw text object
	                var drawCtx = [];
                    //Kinetic text config object.
                    var textConfigObj = {
                        fill:'#fff',
                        fontSize: 40,
                        fontStyle:'bold',
                        fontFamily: 'sans-serif',
                        x: centraPoint.x + Math.cos(funRadian) * textRadius,
                        y: centraPoint.y + Math.sin(funRadian) * textRadius,
                        rotation:(funRadian + Math.PI / 2) / Math.PI * 180
                    };

	                if(angular.isObject(textObj)){
	                	var text = new Kinetic.Text(textConfigObj);
                        text.text(textObj.rate);
                        text.fontSize(60);
		                text.offsetX(text.width() / 2);
                        prizeShapeGroup.add(text);
		                text.offsetY(text.height());
		                var text = new Kinetic.Text(textConfigObj);
                        text.text('等奖');
		                text.offsetX(text.width() / 2);
                        prizeShapeGroup.add(text);
	                }else{
	                	//draw virtual prizes text
		                for(var j=0;j<textObj.length;j=j+2){
	                		var tmpText = textObj[j] + textObj[j+1];
	                		drawCtx.push(tmpText);
	                	}

		                for(var j=0;j<drawCtx.length;j++){
		                	var text = new Kinetic.Text(textConfigObj);
                            text.text(drawCtx[j]);
			                text.offsetX(text.width() / 2);
			                if(j%2 === 0){
			                	text.offsetY(text.height());
			                }
                            prizeShapeGroup.add(text);
		                }
	                }
	            }

	        }

	        function evalPrizeCount(gifts){
	            /* calculate prize count */
	            if(gifts.length < 3){
	                return 4;
	            }else{
	                return 8;
	            }
	        }

	        // mix the gifts and virtual prizes
	        function mixPrizes(gifts){
                var halfShapeAngle = shapeAngle / 2;
                if(gifts.length > 8)
                    gifts.length = 8;
	            var prizes = new Array();
                var virtualPrizes = getRandomVirtualPrizes(prizeCount - gifts.length);
                var vIndex = 0;

                for(var i= 0;vIndex<gifts.length;i++,vIndex++){
                    prizes[i] = gifts[vIndex];
                    prizes[i].angle = (prizeCount - prizes.length) * shapeAngle + halfShapeAngle - startAngle;
                    if(vIndex < virtualPrizes.length){
                        prizes[++i] = virtualPrizes[vIndex];
                        unluckAngle.push((prizeCount - prizes.length) * shapeAngle + halfShapeAngle - startAngle);
                    }
                }
                /* add random virtual prize to short prizes  */
                var left = virtualPrizes.length - vIndex;
                for(var i=0;i<left;i++){
                    prizes.push(virtualPrizes[i + vIndex]);
                    unluckAngle.push((prizeCount - prizes.length) * shapeAngle + halfShapeAngle - startAngle);
                }
                console.debug('prizes',prizes);
                console.debug('unluck angle',unluckAngle);
                function getRandomVirtualPrizes(size){
                    var virtualPrizes = LOTTERY.VIRTUALPRIZES;
                    var tmpPrizes = new Array(size);
                    for(var i=0;i<tmpPrizes.length;i++){
                        tmpPrizes[i] = virtualPrizes[GetRandomNum(0,virtualPrizes.length - 1)];
                    }
                    return tmpPrizes;
                }
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

        //load image
        function loadImage(src,callback){
            var image = new Image();
            image.onload = function(){
                (callback || angular.noop)(image);
            }
            image.src = src;
        }
	}]);
});