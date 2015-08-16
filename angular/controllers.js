angular.module("nutmApp")
.controller("navbarController",function(User,$rootScope){
    $rootScope.user = User;
    $rootScope.$on('AuthError', function(event,type,msg){
        User.logout();
    });
})
.controller("alertController", function ($scope) {
    $scope.alerts = [
        // { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        // { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];
    $scope.$on('AuthError', function(event,type,msg){
        $scope.alerts.push({type:type,msg:msg});
    });
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
})
.controller("adminController",function($scope,API){
    $scope.userList = API.user.query();
})
.controller("userController",function($stateParams,$scope,API,User){

    API.user.get($stateParams,function(user){
        $scope.userDetail = user;
        $scope.newUser = angular.copy(user);
        $scope.admin = function() {
            return User.info.admin === true;
        };
        $scope.canModify = function() {
            return $scope.admin() || (User.info.sub === $scope.userDetail._id);
        };
        $scope.update = function(){
            API.user.update($scope.newUser,function(user, responseHeaders){
                // console.log('Success!', user, responseHeaders);
                $scope.userDetail = user;
                $scope.newUser = angular.copy(user);
            }, function(httpResponse){
                console.log('Failure!', httpResponse);
            });
        };
    });

})
.controller("locationController",function($scope,API){
    $scope.buildingList = API.building.query();
})
.controller("buildingController",function($scope,$stateParams,API){
    $scope.building = API.building.get({buildingId:$stateParams.buildingId});
    $scope.wards = API.ward.query({building:$stateParams.buildingId});
    $scope.newWard = function(newWardName){
        $scope.outcome = API.ward.save({name:newWardName,building:$stateParams.buildingId});
    };
})
.controller("wardController",function($scope,API,$stateParams){
    $scope.tasks = API.task.query({'patient.ward':$stateParams.wardId});
    $scope.deleteWard = function(){
        $scope.outcome = API.ward.delete({wardId:$stateParams.wardId});
    };
})
.controller("taskController",function($scope,API,tasks){
    $scope.tasks = tasks;

    // $scope.addTask = function(){
    //     tasks.new(tasks.);
    // };
    // $scope.addTask = function(){
    //     $scope.tasks.push({
    //         text: $scope.newTask.text,
    //         time: Date.now(),
    //         comments: [
    //             {author: 'Joe', body: 'Cool post!', upvotes: 0},
    //             {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
    //         ]
    //     });
    //     $scope.newTask.text = '';
    // };
})
.controller("newTaskController",function(API,$scope,wards,specialties,$state){
    $scope.wards = wards;
    $scope.specialties = specialties;
    $scope.submit = function(task){
        if ($scope.form.$invalid){
            return false;
        }
        API.task.save(task, function(){
            $state.go('task');
        });
    };
})
.controller("taskDetailController",function($scope,$stateParams,API,task){
    $scope.task = task;
    $scope.addComment = function(comment){
        API.task.save($stateParams, comment, function(){
            API.task.get($stateParams,function(task){
                delete $scope.newComment;
                $scope.task = task;
            });
        });
    };
})
;
