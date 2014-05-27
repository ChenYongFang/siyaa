/*
 * questionnaire details controller
 * autohr: Jeremy
 * date: 2014.05.27
 * Version: 1.0
 * License: siyaa inc
 */

 define(['js/app'],function(app){
	 app.register.controller('QuestionnaireDetailsController',['$scope','DataService',function($scope,DataService){
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
 });