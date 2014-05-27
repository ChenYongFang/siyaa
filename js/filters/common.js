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
 });