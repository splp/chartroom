/**
 * Created by wjtx on 2016/5/4.
 */
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/tasks');
mongoose.disconnect();//关闭mongoose

var Schema = mongoose.Schema;
var Tasks = new Schema({project:String,description:String});
var Task = mongoose.model('Task',Tasks);
var task = new Task();
task.project = 'Bikeshed';
task.description = "Paint the bikeshed red";
task.save(function(err) {
    if (err) throw err;
    console.log('Task saved');
});
var Task = new mongoose.model('Task');
Task.find({"project":"Bikeshed"}, function(err, tasks) {
   for (var i = 0; i < tasks.length; i++) {
       console.log('ID : ' + tasks[i]._id);
       console.log(tasks[i].description);
   }
});

Task.update({_id:"4e65b793d0cfca50800001"},
    {description:"Paint the bikeshed green."},
    {multi:false},function(err, rwos_updated){
     if (err) throw err;
        console.log('UPdate');
});

Task.findById('4e65b793d0cfca50800001', function(err,task){
    task.remove();
})