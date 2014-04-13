/*
 * angular-embs Application's controller
 * autohr: Jeremy
 * date: 2014.04.16
 * embs application controller definition
 * Version: 1.0
 * License: siyaa inc
 */

 // define user modul controller
 EMBS.controller('UserLogin',function($scope,ModalService){

 	$scope.login = function(){
 		ModalService.open('I\'m a modal!','this is a Test');
 	}

 });