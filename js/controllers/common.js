/*
 * application's common controller
 * autohr: Jeremy
 * date: 2014.04.16
 * Version: 1.0
 * License: siyaa inc
 */

 define(['js/app'],function(app){
 	 /* layout template's nav controller */
	 app.controller('InitHomeNav',['$scope','DataService',function($scope,DataService){
	    var params = {pagenum:1,pagesize:9,pid:''};
	    DataService.get({url:'navigation/list4client',params:params,callback:function(data){
	        $scope.menus = data.items;
	    },cache:true});
	 }]);
	 /*ApplicationController is a container for a lot of global application logic, and an alternative to Angular’s run function.*/
	 app.controller('ApplicationController',['$scope','USER_ROLES','AuthService',function($scope,USER_ROLES,AuthService){
	 	$scope.currentUser = null;
	 	$scope.userRoles = USER_ROLES;
	 	$scope.isAuthorized = AuthService.isAuthorized;
	 }]);
 });