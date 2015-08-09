angular.module("nutmApp")
.controller("taskController",function($scope,tasks){
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
.controller("taskDetailController",function($scope,$stateParams,tasks){
    $scope.task = tasks.tasks[$stateParams.taskId];
    $scope.upvote = function(comment){
        comment.upvotes++;
    }
    $scope.addComment = function(){
        $scope.task.comments.push({
            body: $scope.body,
            author: 'Ed',
            upvotes: 0
        });
    };
});