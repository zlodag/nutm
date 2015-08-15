angular.module("nutmApp")
.factory("api", function($resource){
    return {
        user: $resource('/api/user/:userId'),
        task: $resource('/api/task/:taskId')
        // building: $resource('/api/building/:buildingId'),
        // ward: $resource('/api/ward/:wardId'),
    };
});
