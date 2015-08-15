angular.module("nutmApp")
.factory("tasks", function(api){
    var tasks = [];
    return {
        // tasks: [{text: "clean the bleeding rubbish", time: Date.now()}, {text: "put out the laundry", time: Date.now()}]
        get tasks(){return tasks;},
        getAll : function(){
            tasks = api.task.query();
        },
        addOne : function(task){
            tasks.push(api.task.save(task));
        }
    };
});
