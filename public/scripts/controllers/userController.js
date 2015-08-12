angular.module("nutmApp")
.controller("userController",function($scope,$resource,$stateParams){
    var api = $resource('/api/user/:userId',$stateParams);
    $scope.user = api.get();
});