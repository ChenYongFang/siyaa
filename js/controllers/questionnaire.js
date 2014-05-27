/*
 * questionnaire controller
 * autohr: Jeremy
 * date: 2014.05.27
 * Version: 1.0
 * License: siyaa inc
 */

 define(['js/app'],function(app){
	app.register.controller('QuestionnaireController',['$scope','DataService',function($scope,DataService){
	 	var questionnaires = {
	 		totalItem:10,
	 		totalPage:2,
	 		items:[
	 			{id:1,title:'看你内心是什么样子的。',startTime:1399960400000,endTime:1399960499000},
	 			{id:2,title:'谁是你交心的死党？',startTime:1399960400000,endTime:1399960499000},
	 			{id:3,title:'同桌的你到底啥样？',startTime:1399960400000,endTime:1399960499000},
	 			{id:4,title:'你能当催眠大师吗？',startTime:1399960400000,endTime:1399960499000},
	 			{id:5,title:'你的运气都去哪了？',startTime:1399960400000,endTime:1399960499000}
	 		]
	 	};
	 	$scope.questionnaires = questionnaires;
	}]);
 });