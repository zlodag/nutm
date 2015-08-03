angular.module("nutmApp").controller("nutmFarce",function($scope,$window,nutmAuth){
    $scope.spud = "potato chicken!";
    $scope.token = $window.sessionStorage.getItem("token");
    $scope.auth = {};
    $scope.submit = function(){
        nutmAuth.save($scope.auth, function(response) {
            $scope.message = response.message;
            if (response.success === true) {
                $scope.token = response.token;
                $window.sessionStorage.setItem("token", response.token);
            }
        });
    };
});
