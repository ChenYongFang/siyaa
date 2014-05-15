/*
 * questionnaire module
 * autohr: Jeremy
 * date: 2014.05.13
 * Version: 1.0
 * License: siyaa inc
 */

 var QuestionnaireModule = angular.module('questionnaireModule',[]);

/*********** questionnaire module controller ***********/
QuestionnaireModule.controller('QuestionnaireController',['$scope','DataService',function($scope,DataService){
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
QuestionnaireModule.controller('QuestionnaireDetailsController',['$scope','DataService',function($scope,DataService){
 	var questions = {
 		hint:'',
 		activityId:2,
 		name:'看你内心是什么样子的。',
 		items:[{
 			id:1,
 			type:0, //0单选1多选2输入
 			question:'你在森林里看到一间房间，你觉得里面会有什么？',
 			select:[
 				{id:1,name:'一位老婆婆'},
 				{id:2,name:'温文尔雅的一家人'},
 				{id:3,name:'一个粗犷的猎户'},
 				{id:4,name:'空无一人'},
 				{id:4,name:'屋子里面有鬼'}
 			]
 		}]
 	};
 	var totalQuestion = questions.items.length;
 	$scope.question = questions.items[0];
 	$scope.question.index = 0;
 	$scope.questionnaire = {hint:questions.hint,activityId:questions.activityId,name:questions.name};

 	$scope.nextQuestion = function(){
 		$scope.question.index++;
 		$scope.question = questions.items[questionIndex];
 	}

}]);