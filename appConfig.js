/* ex: set tabstop=4 expandtab: */
var path = require('path');

var consoleArgs = process.argv.slice(2);
var supportedArgs = [
    'debug', '-d',
    'verbose', '-v',
    'post', '-p'
];
var isDebug = exports.isDebug = hasConsoleArgs(supportedArgs.slice(0,2));
var isVerbose = exports.isVerbose = hasConsoleArgs(supportedArgs.slice(2,4));
var postProcessor = exports.postProcessor = getConsoleArgs(supportedArgs.slice(4,6));

var srcDir = exports.srcDir = path.join(__dirname, 'src'); // Template sources
var releaseDir = exports.releaseDir = path.join(__dirname, 'release'); // Website release
var contentDir = exports.contentDir = path.join(__dirname, 'content'); // Markdown content

var mapping = exports.mapping = {
    'team': '/team'
};

function getConsoleArgs(args){
    // Summary:
    //      Returns the property of a console arg.
    for (var i=0, l=args.length; i<l; i++){
        var index = consoleArgs.indexOf(args[i]);
        if (index!=-1){
            return supportedArgs.indexOf(consoleArgs[index+1]) > -1 ? false : consoleArgs[index+1];
        }
    }
    return false;
}

function hasConsoleArgs(args){
    // Summary:
    //      Returns a boolean for whether an argument got passed.
    for (var i=0, l=args.length; i<l; i++){
        if (consoleArgs.indexOf(args[i])!=-1){
            return true;
        }
    }
    return false;
}

exports.printValues = function(){
    console.log('');
    console.log('  Debug mode (-d)\t\t' + isDebug);
    console.log('  Verbose mode (-v)\t\t' + isVerbose);
    console.log('  Post processor (-p) filename\t\t' + postProcessor);
    console.log('');
}
