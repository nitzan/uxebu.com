// global imports
var mustache = require('mustache');
var md = require('markdown').markdown;
// app imports
var appConfig = require('./appConfig');


exports.consoleLog = function(messages){
    // Summary:
    //      Log to the console using the given templates and context variables.
    //      Additionally you can specify that a message shall only be rendered in verbose mode.
    // Example:
    //      consoleLog([
    //                  {tpl:WARNING_USING_DEFAULT_RENDERER.TITLE, vars:{}}]),
    //                  {tpl:WARNING_USING_DEFAULT_RENDERER.HINT, vars:{}, verbose:true} // Will only print in verbose mode
    //              ]);
    for (var i=0, l=messages.length, m; i<l; i++){
        m = messages[i];
        if (typeof m.verbose=="undefined" || (typeof m.verbose!="undefined" && m.verbose==true && appConfig.isVerbose)){
            if (m.msg){ // If given we straight print the message, no mustache needed.
                console.log(m.msg);
            } else {
                console.log(mustache.to_html(m.tpl, m.vars || {}));
            }
        }
    }
}


exports.parseMarkdown = function(tree){
    // Summary:
    //      Parses the markdown tree and splits the array into chunks based
    //      on the h1 as a separator:
    //
    //          Title
    //          =====
    //
    //          Content
    //
    //          Title
    //          =====
    //
    //          More content
    //
    //      Resulting in
    //
    //          [
    //              [ [ 'h1', 'Title' ],[ 'p', 'Content' ] ],
    //              [ [ 'h1', 'Title' ],[ 'p', 'More content' ] ]
    //          ]

    var tree = md.toHTMLTree(tree);
    var blocks = [];
    var block = [];
    tree = tree.splice(1);
    while(tree.length){
        if (block.length && tree[0][0] == 'h1'){
            blocks.push(block);
            block = [];
        } else {
            block.push(tree.shift());
        }
    };
    blocks.push(block);
    return blocks;
}
