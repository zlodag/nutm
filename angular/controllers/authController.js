angular.module("nutmApp").controller("authController",function($scope,User){
    $scope.showUsers = function(){
        User.admin.showUsers(function(users){
            $scope.userList = users;
        }, function(response){
            $scope.userList = [];
        })
    }
    $scope.user = User;
    // $scope.submit = function(){
    //     nutmAuth.submit($scope.auth, function(response) {
    //         $scope.message = response.message;
    //         if (response.success === true) {
    //             $scope.token = response.token;
    //             $window.sessionStorage.setItem("token", response.token);
    //         }
    //     });
    // };
});
