function asyncFunction(callback) {
    setTimeout(callback, 200);
}
var color = 'bule';
asyncFunction(function(){
    console.log('the color is ' +　color);
})
console.log('nomarl');
(function(color) {
    asyncFunction(function(){
        console.log('the color is ' +　color);
    })
})(color);
color = 'green';
setTimeout(function(){
    console.log('I  execute first');
    setTimeout(function(){
        console.log('I execute next');
        setTimeout(function(){
            console.log('I execute last.');
        },100)
    },500)
},1000)

var flow = require('nimble');
flow.series([function(callback){
    setTimeout(function(){
        console.log('I execute first');
        callback();
    },1000)
},
function(callback){
    setTimeout(function(){
        console.log('I execute next');

    },500)
}, function(){
        setTimeout(function(){
            console.log('I execute last.');
        },100)
    }])