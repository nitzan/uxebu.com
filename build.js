/* ex: set tabstop=4 expandtab: */

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
        TITLE: 'ERROR: Syntax error in "{{markdownFileName}}", stopped parsing block "{{blockTitle}}".',
        HINT: 'In the following find explaination about the syntax of this markdown block.'
    },
    WARNING_USING_DEFAULT_RENDERER:{
        TITLE: 'WARNING: No render method given for block "{{blockTitle}}" in "{{tplFileName}}.html" using the default method "simpleBox".',
        HINT: 'If you want to set a render method use mustache comments for it, like so: { {!simpleBox} } or { {!listBox} }.'
    }
};

// Simple mixin, note: it does not check for hasOwnProperty!
function mixin(target, obj){
    for (var prop in obj){
        target[prop] = obj[prop];
    }
}

function readDir(dir){
    fs.readdir(dir, function(err, data){
        appUtil.statusLog('Reading HTML files from\t' + dir);
        data && data.forEach(function(item){
            if (item.indexOf('.html') > -1){
                if (appConfig.isVerbose) appUtil.statusLog("\t...." + item);
                renderView(item.split('.html')[0]);
            }
        });
    });
}

function clean(callb){
    // Summary:
    //      1. Cleaning up release dir
    //      2. Copying media and static files to release dir
    appUtil.statusLog('Deleting\t' + appConfig.releaseDir + '/*');
    exec('rm -rf ' + appConfig.releaseDir + '/*', function(err, stdout, stderr){
        appUtil.statusLog('Copying\t' + appConfig.srcDir + '/static to' + appConfig.releaseDir + '/');
        appUtil.statusLog('Copying\t' + appConfig.contentDir + '/media to ' + appConfig.releaseDir + '/');
        var cmd = 'cp -r ' + appConfig.srcDir + '/static ' + appConfig.releaseDir + '/;';
        cmd += 'cp -r ' + appConfig.contentDir + '/media  ' + appConfig.releaseDir + '/';
        exec(cmd,
            function (err, stdout, stderr) {
                if (err !== null) {
                    console.log('Error copying (' + cmd + ') static files: ' + err);
                }else{
                    console.log('Copied static files');
                    callb && callb();
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
    //
    //      NOTE: The template block renderers are asynchronous so they can fetch
    //      information from remote resources. We therefor first render a dummy template to determine the
    //      blocks used, activate the blocks and parse the result to the provided callback. Once
    //      the callback count is equal to the block count we know we can write out the final HTML rendered
    //      file.

    function readMarkdown(template, input, output, name){
        appUtil.statusLog('Reading and parsing \t' + appConfig.srcDir + '/' + name + '.md');
        fs.readFile(input, 'utf-8', function(arr, markdown){
            // 3.
            var tree = appUtil.parseMarkdown(markdown);
            var tplContent = {
                errorMessage:""
            };
            tplContent[name] = true;

            var tplC = {}; // Temporary obj holding all blocks from the markdown file

            var cnt = 0;
            var errorMessages = []; // Store all the error messages and concat them later.
            tree.forEach(function(block, index){
                // Based on the tree array we create mustache blocks with custom callbacks
                // handling the mapping of Markdown elements to Mustache tags.

                // This is the callback which gets passed into the different block renderers.
                function callb(view, index){
                    cnt++;
                    tplContent['block' + index] = view;
                    if (cnt == tree.length){
                        writeView(output, template, tplContent);
                    }
                }

                tplC['block' + index] = function(){
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
                        }
                        try {
                            var parsedBlock = blocks[func]([].concat(block), (function(index){
                                return function(view){
                                    callb(view, index);
                                }
                            })(index)); // Make a copy of the block, since the method modifies it inside.
                        }catch(e){
                            var errorMsg = {
                                title: mustache.to_html(templates.ERROR_MARKDOWN_SYNTAX.TITLE, {markdownFileName:input, blockTitle:block[0][1]}),
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
            mustache.to_html(template, tplC);
        });
    }

    function readContentDir(name, template){
        exec('mkdir ' + appConfig.releaseDir + name, function(){
            fs.readdir(appConfig.contentDir + name, function(err, data){
                data && data.forEach(function(item){
                    if (item.indexOf('.md') > -1){
                        var fileName = item.split('.md')[0];
                        readMarkdown(template, appConfig.contentDir + name + '/' + fileName+ '.md', appConfig.releaseDir + name + '/' + fileName + '.html', fileName);
                    }
                });
            });
        });
    }

    // 1.
    //
    fs.readFile(appConfig.srcDir + '/' + name + '.html', 'utf-8', function(err, template){
        // 2.
        if (appConfig.mapping[name]){
            var map = appConfig.mapping[name];
            if (Object.prototype.toString.apply(map) === '[object Array]'){
                map.forEach(function(item){
                    if (item.indexOf('.md') > -1){
                        var fileName = item.split('.md')[0];
                        readMarkdown(template, appConfig.contentDir + '/' + fileName + '.md', appConfig.releaseDir + '/' + fileName + '.html', name);
                    }else{
                        readContentDir(item, template);
                    }
                });
            }else if (Object.prototype.toString.apply(map) === '[object String]'){
                if (map.indexOf('.md') > -1){
                    var fileName = item.split('.md')[0];
                    readMarkdown(template, appConfig.contentDir + '/' + fileName + '.md', appConfig.releaseDir + '/' + fileName + '.html', name);
                }else{
                    readContentDir(map, template);
                }
            }
        }else{
            readMarkdown(template, appConfig.contentDir + '/' + name + '.md', appConfig.releaseDir + '/' + name + '.html', name);
        }

    });
}

function writeView(output, template, tplContent){
    var out = mustache.to_html(template, tplContent);

    // The markdown parser returns elements which don't require a closing tag with a closing tag
    // Converting <br></br> to <br />
    var voidTags = /^area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr$/i;
    out = out.replace(/<(\w+)([^<>]*)><\/\1>/g, function(_, tagName, attribs){
        var markup = "<" + tagName + attribs;
        markup += voidTags.test(tagName) ? " />" : "></" + tagName + ">";
        return markup;
    });

    // 6.
    // If debug is true we compress the HTML and write it to the filesystem
    appUtil.statusLog('Writing\t' + output);
    fs.writeFile(output, appConfig.isDebug ? out : kompressor(out, true), encoding='utf8');
}

// Description:
//      This build tool renders HTML pages based on markdown pages and HTML templates
//      The default build required to have for instance a home.html template and a home.md
//      content file. Optionally you can define a mapping of one HTML to several markdown files.
//
//      The mapping must map to a directory e.g.
//          { 'team': 'team/' }
//      would map all Markdown files in the /team directory to the team.html template.
//
//      Application Flow:
//
//      1. Cleanup previous build
//      2. Read the contents of the source directory
//      3. Read the Markdown content (optionally iterative if mapping is present)
//      4. Write out result

console.log('Welcome to the epic');
appConfig.printValues();
clean(function(){
    // Reading src directory and passing found HTML file names to renderView()
    readDir(appConfig.srcDir);
});

