angular.module("nutmApp").controller("nutmFarce",function($scope,User){
    $scope.showUsers = function(){
        User.admin.showUsers(function(response){
            $scope.userList = response.users;
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
