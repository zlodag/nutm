angular.module("nutmApp").controller("nutmFarce",function($scope,$window,nutmAuth,nutmAdmin){
    $scope.spud = "potato chicken!";
    $scope.token = $window.sessionStorage.getItem("token");
    $scope.auth = {};
    $scope.userList = [];
    $scope.showUsers = function(){
        nutmAdmin.showUsers(function(response){
            if (response.success === true) {
                $scope.userList = response.users;
            }
        })
    }
    $scope.submit = function(){
        nutmAuth.submit($scope.auth, function(response) {
            $scope.message = response.message;
            if (response.success === true) {
                $scope.token = response.token;
                $window.sessionStorage.setItem("token", response.token);
            }
        });
    };
});
