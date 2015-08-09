angular.module("nutmApp")
.factory("tasks", function($resource){
    var t = $resource('/api/tasks/:id');
    var o = {
        // tasks: [{text: "clean the bleeding rubbish", time: Date.now()}, {text: "put out the laundry", time: Date.now()}]
        tasks: [],
        getAll : function(){
            this.tasks = t.query();
        },
        addOne : function(){
            this.tasks.push(t.save());
        }
    };
    return o;
});