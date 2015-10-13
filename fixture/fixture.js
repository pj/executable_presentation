/*slide
# This is a slide

???
These are some slide comments.
*/

/*
This is a comment that should be ignored.
*/

function not_included_function(foo){
    return foo + 1;
}

// This comment should also be ignored.
function includable_function(arg){
    var something = not_included_function(arg);
    return something;
}

/*slide
# This is another slide

It has included code:

%(includable_function)s
???
These are some slide comments.
*/

var z = 0;

for (var x = 0; x < 10; x++) {
    z += includable_function(x);
}

module.exports.includable_function = includable_function;
