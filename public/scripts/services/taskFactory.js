angular.module("nutmApp")
.factory("tasks", function(){
    var o = {
        // tasks: [{text: "clean the bleeding rubbish", time: Date.now()}, {text: "put out the laundry", time: Date.now()}]
        tasks: []
    };
    return o;
});