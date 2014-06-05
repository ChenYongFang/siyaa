/*
 * application's common filters
 * autohr: Jeremy
 * date: 2014.04.16
 * Version: 1.0
 * License: siyaa inc
 */

 define(['js/app'],function(app){
 	//filter for setSize loop
 	app.filter('stepSize',function(){
	    return function(data,value){
	        if(!data)
	            return;
	        var newData = [];
	        for(var i = 0; i < data.length; i+=value){
	            newData.push(data[i]);   
	        }
	        return newData;
	    }
	});

	//parse number to be Chinese number e.g 123 一二三
	app.filter('chineseNum',function(){

		var N = ["零","一","二","三","四","五","六","七","八","九"];

		return function(data,value){
			if(!data || !angular.isNumber(data))
				return;
			var str = data.toString();
			var len = data.toString().length;
			var C_Num = [];
			for(var i = 0; i < len; i++){
				C_Num.push(N[str.charAt(i)]);
			}
			return C_Num.join('');
		}
	});
 });