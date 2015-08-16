angular.module("nutmApp")
.controller("authController",function(User,$scope,api,$state){
    $scope.user = User;
    $scope.logout = function(){
        User.logout();
        // $state.go('login');
    }
})
.controller("adminController",function($scope,api){
    $scope.userList = api.user.query();
});
