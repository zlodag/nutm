angular.module("nutmApp")
.controller("locationController",function($resource,$scope){
    $scope.api = {
        building: $resource('/api/building/:buildingId'),
        ward: $resource('/api/ward/:wardId')
    };
    $scope.buildingList = $scope.api.building.query();
})
.controller("buildingController",function($scope,$stateParams){
    $scope.building = $scope.api.building.get({buildingId:$stateParams.buildingId});
    $scope.newWard = function(newWardName){
        $scope.outcome = $scope.api.ward.save({name:newWardName,building:$stateParams.buildingId});
    };
})
.controller("wardController",function($scope,$stateParams){
    $scope.ward = $scope.api.ward.get({wardId:$stateParams.wardId});
    $scope.delete = function(){
        $scope.outcome = $scope.api.ward.delete({wardId:$stateParams.wardId});
    };
});