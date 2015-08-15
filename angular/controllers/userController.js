angular.module("nutmApp")
.controller("userController",function($stateParams,$scope,api){
	$scope.userDetail = api.user.get($stateParams);
});
