/*
 * user module
 * autohr: Jeremy
 * date: 2014.04.16
 * Version: 1.0
 * License: siyaa inc
 */

var UserModule = angular.module('userModule',[]);
 //UserModule Auth service
UserModule.factory('AuthService',['DataService','Session',function(DataService,Session){
	return {
		login:function(credentials){
			return DataService.post({url:'usermgr/user/mobile/login',data:credentials,callback:function(res){
				//store user infomation.
				Session.create(res.id,res.userId,res.userRole,res.userInfo);
			}});
		},
		isAuthenticated:function(){
			return !!Session.userId;
		},
		isAuthorized:function(authorizedRoles){
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
		}
	}
}]);
UserModule.factory('AuthInterceptor',['$rootScope','$q','AUTH_EVENTS',function($rootScope,$q,AUTH_EVENTS){
	return {
		responseError:function(response){
			switch(response.status){
				case 401:
					$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated,response);
					break;
				case 403:
					$rootScope.$broadcast(AUTH_EVENTS.notAuthorized,response);
					break;
				case 419:
				case 440:
					$rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,response);
					break;
			}
			return $q.reject(response);
		}
	};
}]);
//define user session service
UserModule.service('Session',function(){
	this.create = function (sessionId, userId, userRole, userInfo) {
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
		this.userInfo = userInfo;
	};
	this.destroy = function () {
		this.id = null;
		this.userId = null;
		this.userRole = null;
		this.userInfo = null;
	};
	return this;
});
//define all of the available login state event 
UserModule.constant('AUTH_EVENTS',
	{
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	}
);
//define all of the role rights
UserModule.constant('USER_ROLES',
	{
		all: '*',
		admin: 'admin',
		editor: 'editor',
		guest: 'guest'
	}
);
/*********** user module controller ***********/
UserModule.controller('LoginController',['$scope','ModalService','DataService',function($scope,ModalService,DataService){

 	$scope.credentials = {loginname:'',password:''};
 	$scope.login = function(credentials){
 		
 	}
 	
}]);