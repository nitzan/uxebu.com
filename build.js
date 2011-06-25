// global imports
var fs = require('fs');
var md = require('markdown').markdown;
var mustache = require('mustache');
var exec  = require('child_process').exec;
var kompressor = require('htmlKompressor');
// app imports
var blocks = require('./blocks/block');
var appUtil   = require('./appUtil');
var appConfig   = require('./appConfig');

// Define a couple of templates that are used multiple times or
// are text strings that should be maintainable and not spread all over the code.
var templates = {
    ERROR_MARKDOWN_SYNTAX:{
        TITLE: 'ERROR: Syntax error in "{{markdownFileName}}.md", stopped parsing block "{{blockTitle}}".',
        HINT: 'In the following find explaination about the syntax of this markdown block.'
    },
    WARNING_USING_DEFAULT_RENDERER:{
        TITLE: 'WARNING: No render method given for block "{{blockTitle}}" in "{{tplFileName}}.html" using the default method "simpleBox".',
        HINT: 'If you want to set a render method use mustache comments for it, like so: { {!simpleBox} } or { {!listBox} }.'
    }
};

console.log('Welcome to the epic');
appConfig.printValues();

// Simple mixin, note: it does not check for hasOwnProperty!
function mixin(target, obj){
    for (var prop in obj){
        target[prop] = obj[prop];
    }
}

// Reading src directory and passing found HTML file names to renderView()
fs.readdir(appConfig.srcDir, function(err, data){
    clean();

    appUtil.statusLog('Reading HTML files from\t' + appConfig.srcDir);
    data.forEach(function(item){
        if (item.indexOf('.html') > -1){
            if (appConfig.isVerbose) appUtil.statusLog("\t...." + item);
            renderView(item.split('.html')[0]);
        }
    });
});

function clean(){
    // Summary:
    //      1. Cleaning up release dir
    //      2. Copying media and static files to release dir
    appUtil.statusLog('Deleting\t' + appConfig.releaseDir + '/*');
    exec('rm -rf ' + appConfig.releaseDir + '/*', function(err, stdout, stderr){
        appUtil.statusLog('Copying\t' + appConfig.srcDir + '/static to' + appConfig.releaseDir + '/');
        appUtil.statusLog('Copying\t' + appConfig.contentDir + '/media to ' + appConfig.releaseDir + '/');
        exec('cp -r ' + appConfig.srcDir + '/static ' + appConfig.contentDir + '/media  ' + appConfig.releaseDir + '/',
            function (err, stdout, stderr) {
                if (err !== null) {
                    console.log('Error copying static files: ' + error);
                }else{
                    console.log('Copied static files');
                }
            }
        );
    })
}

function renderView(name){
    // Summary:
    //      1. Reads HTML file
    //      2. Reads Markdown file
    //      3. Deconstructs Markdown tree into blocks
    //      4. Determines proper function which returns Mustache view
    //      5. Renders HTML
    //      6. Writes output to filesystem

    // 1.
    fs.readFile(appConfig.srcDir + '/' + name + '.html', 'utf-8', function(err, template){
        // 2.
        appUtil.statusLog('Reading and parsing \t' + appConfig.srcDir + '/' + name + '.md');
        fs.readFile('content/' + name + '.md', 'utf-8', function(arr, markdown){
            // 3.
            var tree = appUtil.parseMarkdown(markdown);
            var tplContent = {errorMessage:""};
            var errorMessages = []; // Store all the error messages and concat them later.
            tree.forEach(function(block, index){
                // Based on the tree array we create mustache blocks with custom callbacks
                // handling the mapping of Markdown elements to Mustache tags.
                tplContent['block' + index] = function(){
                    return function(text, parse){
                        // 4.
                        // Looking for mustache comment '{{!boxName}}' which specifies the box's render method
                        // we want to use, if none found we default to "simpleBox".
                        var boxMatch = text.match(/[\s\S]*{{!(\w+)}}/);
                        var func;
                        if (boxMatch){
                            func = boxMatch[1];
                        } else {
                            func = "simpleBox";
                            appUtil.consoleLog([
                                {tpl: templates.WARNING_USING_DEFAULT_RENDERER.TITLE, vars:{tplFileName:name, blockTitle:block[0][1]}},
                                {tpl: templates.WARNING_USING_DEFAULT_RENDERER.HINT, verbose:true}
                            ]);
                        }
                        try {
                            var parsedBlock = blocks[func]([].concat(block)); // Make a copy of the block, since the method modifies it inside.
                            return mustache.to_html(text, parsedBlock);
                        }catch(e){
                            var errorMsg = {
                                title: mustache.to_html(templates.ERROR_MARKDOWN_SYNTAX.TITLE, {markdownFileName:name, blockTitle:block[0][1]}),
                                text: blocks[func].__docs__
                            };
                            errorMessages.push(errorMsg);
                            appUtil.consoleLog([
                                {msg: errorMsg.title},
                                {msg: '\n' + mustache.to_html(templates.ERROR_MARKDOWN_SYNTAX.HINT, {}), verbose:true},
                                {msg: '\n' + errorMsg.text, verbose:true}
                            ]);
                            return "";
                        }
                    }
                }
            });

            // 5.
            if (errorMessages.length){
console.log('errorMessages = ', JSON.stringify(errorMessages));
                var titles = [];
                var texts = [];
                errorMessages.forEach(function(m){ titles.push(m.title); texts.push(m.text); });
console.log('texts = ', texts);
console.log('titles = ', titles);
                tplContent.errorMessage = titles.join("\n") + "\n\n" + texts.join("\n************************\n");
            }
            var out = mustache.to_html(template, tplContent);

            // The markdown parser returns elements which don't require a closing tag with a closing tag
            // Converting <br></br> to <br />
            var voidTags = /area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/i;
            out = out.replace(/<(\w+)([^<>]*)><\/\1>/g, function(_, tagName, attribs){
                var markup = "<" + tagName + attribs;
                markup += voidTags.test(tagName) ? " />" : "></" + tagName + ">";
                return markup;
            });

            // 6.
            // If debug is true we compress the HTML and write it to the filesystem
            appUtil.statusLog('Writing\t' + appConfig.releaseDir + '/' + name + '.html');
            fs.writeFile(appConfig.releaseDir + '/' + name + '.html', appConfig.isDebug ? out : kompressor(out, true), encoding='utf8');
        });
    });
}
