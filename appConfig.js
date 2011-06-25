

var consoleArgs = process.argv.slice(2);
var isDebug = exports.isDebug = hasConsoleArgs(['debug', '-d']);
var isVerbose = exports.isVerbose = hasConsoleArgs(['verbose', '-v']);

var srcDir = exports.srcDir = './src'; // Template sources
var releaseDir = exports.releaseDir = './release'; // Website release
var contentDir = exports.contentDir = './content'; // Markdown content


function hasConsoleArgs(args){
    for (var i=0, l=args.length; i<l; i++){
        if (consoleArgs.indexOf(args[i])!=-1){
            return true;
        }
    }
    return false;
}

exports.printValues = function(){
    console.log('  Debug mode (-d)\t\t' + isDebug);
    console.log('  Verbose mode (-v)\t\t' + isVerbose);
    console.log('');
}