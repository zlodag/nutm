angular.module("nutmApp")
.controller("authController",function(User,$scope,api,$state){
    $scope.user = User;
    $scope.showUsers = function(){
        $scope.userList = api.user.query();
    };
    $scope.logout = function(){
        User.logout();
        $state.go('login');
    }
});
