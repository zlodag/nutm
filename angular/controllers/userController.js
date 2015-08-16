angular.module("nutmApp")
.controller("userController",function($stateParams,$scope,api,User){
	$scope.userDetail = api.user.get($stateParams);
	$scope.admin = function() {
		return User.token.admin === true;
	};
	$scope.canModify = function() {
		return $scope.admin || (User.token.sub === $scope.userDetail.id);
	};
});
