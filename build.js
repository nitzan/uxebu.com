/* ex: set tabstop=4 expandtab: */

// global imports
var fs = require('fs');
var path = require('path');
var sys = require('sys');
var md = require('markdown').markdown;
var mustache = require('mustache');
var exec  = require('child_process').exec;
var kompressor = require('htmlKompressor');
var less = require('less');

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

var errorMessages = []; // Store all the error messages and concat them later.

// Simple mixin, note: it does not check for hasOwnProperty!
function mixin(target, obj){
    for (var prop in obj){
        target[prop] = obj[prop];
    }
}

//////////////////////////////////////////////////////

// Description:
//      This build tool renders HTML pages based on markdown pages and HTML templates
//      The default build requires mapping of markdown files to html templates (home.md -> home.html)
//      Optionally you can define one-to-many HTML to Markdown mapping.
//
//      One-to-many mapping must map to a directory e.g.
//
//          { 'team': 'team/' }
//
//      maps all Markdown files in the /team directory to the team.html template.
//
//      App flow:
//
//      1. Cleanup previous build: clean()
//      2. Reading contents of the source directory based on processFiles call: processFiles()
//      3. Reading Markdown content (optionally iterative if mapping is present): readMarkdown()
//      4. Write out result: writeView()
//      5. Compiling less to one CSS-file: prepareLess()

console.log('Welcome to the epic');
appConfig.printValues();
clean(function(){
    processFiles('', true);
    processFiles('/error', false); // Static, no markdown

    fs.mkdirSync(path.join(appConfig.releaseDir, "static", "css"), 0755);
    processLess(path.join(appConfig.releaseDir, "static/less/style.less"), path.join(appConfig.releaseDir, "static/css/style.css"));

    if (appConfig.postProcessor){
        console.log('Firing up post processor');
        require(appConfig.postProcessor);
    }
});

//////////////////////////////////////////////////////

function clean(callb){
    // Summary:
    //      1. Cleaning up release dir
    //      2. Copying media, static files and favicon.ico to release dir
    //      3. Call provided callback

    appUtil.statusLog('Deleting\t' + appConfig.releaseDir + '/*');
    exec('rm -rf ' + appConfig.releaseDir + '/*', function(err, stdout, stderr){
        appUtil.statusLog('Copying\t' + appConfig.srcDir + '/static to ' + appConfig.releaseDir + '/');
        var cmd = 'cp -r ' + appConfig.srcDir + '/static ' + appConfig.releaseDir + '/;';

        appUtil.statusLog('Copying\t' + appConfig.contentDir + '/media to ' + appConfig.releaseDir + '/');
        cmd += 'cp -r ' + appConfig.contentDir + '/media  ' + appConfig.releaseDir + '/;';

        appUtil.statusLog('Copying\t' + appConfig.contentDir + '/favicon.ico to ' + appConfig.releaseDir + '/');
        cmd += 'cp ' + appConfig.contentDir + '/favicon.ico  ' + appConfig.releaseDir + '/';

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
    });
}

function processFiles(dir, hasMarkdown){
    // Summary:
    //      Reads out files from src directory and then kicks of the (optional) markdown parsing and rendering-to-file
    //      process.
    //
    //      1. Reading of src dir
    //      2. Checking whether we want to map several md files onto one template
    //      3. Kick of the (optional) markdown renderer and rendering the result to file.

    // 1.
    appUtil.statusLog('Reading HTML files from\t' + appConfig.srcDir + dir);
    var fileNames = fs.readdirSync(appConfig.srcDir + dir);
    fileNames && fileNames.forEach(function(file){
        if (file.indexOf('.html') > -1){

            var resourceName = file.split('.html')[0];
            var tmplLocation = appConfig.srcDir + dir + '/' + file;
            var tmplContent = fs.readFileSync(tmplLocation, 'utf-8');

            // 2.
            // Check whether we have a specific html to markdown mapping
            // one to many relationship
            if (appConfig.mapping[resourceName]){
                var map = appConfig.mapping[resourceName];

                function render(tmplContent, dir, resourceName){
                    var parseProps = {};
                    if (appConfig.isDebug){
                        parseProps.useLess = true;
                    }
                    // 3.
                    hasMarkdown && readMarkdown(appConfig.contentDir + dir + '/' + resourceName + '.md', resourceName, parseProps);
                    writeView(dir, resourceName + '.html', tmplContent, parseProps);
                }

                function processMapping(item, resourceName, tmplContent){
                    if (item.indexOf('.md') > -1){
                        var resourceName = item.split('.md')[0];
                        render(tmplContent, dir, resourceName);
                    }else{
                        var filenNames = fs.readdirSync(appConfig.contentDir + item);
                        filenNames && filenNames.forEach(function(file){
                            if (file.indexOf('.md') > -1){
                                var resourceName = file.split('.md')[0];
                                render(tmplContent, dir + item, resourceName);
                            }
                        });
                    }
                }

                if (Object.prototype.toString.apply(map) === '[object Array]'){
                    map.forEach(function(item){
                        processMapping(item, resourceName, tmplContent);
                    });
                }else if (Object.prototype.toString.apply(map) === '[object String]'){
                    processMapping(map, resourceName, tmplContent);
                }
            }else{
                render(tmplContent, dir, resourceName);
            }
        }
    });
}

var css;
function processLess(input, output){
    fs.readFile(input, 'utf-8', function (e, data){
        if (e){
            sys.puts("less: " + e.message);
            process.exit(1);
        }

        new(less.Parser)({
            paths: [path.dirname(input)],
            optimization: 1,
            filename: input
        }).parse(data, function (err, tree){
            if (err){
                less.writeError(err, options);
                process.exit(1);
            }else{
                try{
                    css = tree.toCSS({ compress: true });
                    if (output){
                        fd = fs.openSync(output, "w");
                        appUtil.statusLog('Compiling less');
                        appUtil.statusLog('Less input \t' + input);
                        appUtil.statusLog('Less output \t' + output);
                        fs.writeSync(fd, css, 0, "utf8");
                    }else{
                        sys.print(css);
                    }
                }catch (e){
                    less.writeError(e, options);
                    process.exit(2);
                }
            }
        });
    });
}

function readMarkdown(input, name, parseProps){
    // Summary
    //      1. Reads markdown file
    //      2. Preparing rendering callback

    appUtil.statusLog('Reading and parsing \t' + input);
    var markdown = fs.readFileSync(input, 'utf-8');
    var tree = appUtil.parseMarkdown(markdown);
    parseProps.errorMessage = "";
    parseProps[name] = true;
    tree.forEach(function(block, index){
        // Based on the tree array we create mustache blocks with custom callbacks
        // handling the mapping of Markdown elements to Mustache tags.
        parseProps['block' + index] = function(){
            return function(text, parse){
                // Looking for mustache comment '{{!boxName}}' which specifies the box's render method
                // we want to use, if none found we default to "simpleBox".
                var boxMatch = text.match(/[\s\S]*{{!(\w+)}}/);
                var func;
                if (boxMatch){
                    func = boxMatch[1];
                } else {
                    func = "simpleBox";
                    appUtil.consoleLog([
                        {tpl: templates.WARNING_USING_DEFAULT_RENDERER.TITLE, vars:{tplFileName:input, blockTitle:block[0][1]}},
                        {tpl: templates.WARNING_USING_DEFAULT_RENDERER.HINT, verbose:true}
                    ]);
                }
                try {
                    var parsedBlock = blocks[func]([].concat(block)); // Make a copy of the block, since the method modifies it inside.
                    return mustache.to_html(text, parsedBlock);
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
}

function writeView(dir, fileName, tmplContent, parseProps){
    // Summary:
    //      Renders the parse properties into the template and
    //      write the output to the release directory.

    try {
        fs.mkdirSync(path.join(appConfig.releaseDir, dir), 0755);
    }catch(e){}

    if (errorMessages.length){
        var titles = [];
        var texts = [];
        errorMessages.forEach(function(m){ titles.push(m.title); texts.push(m.text); });
        parseProps.errorMessage = titles.join("\n") + "\n\n" + texts.join("\n************************\n");
    }

    var out = mustache.to_html(tmplContent, parseProps);

    // The markdown parser returns elements which don't require a closing tag with a closing tag
    // Converting <br></br> to <br />
    var voidTags = /^area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr$/i;
    out = out.replace(/<(\w+)([^<>]*)><\/\1>/g, function(_, tagName, attribs){
        var markup = "<" + tagName + attribs;
        markup += voidTags.test(tagName) ? " />" : "></" + tagName + ">";
        return markup;
    });

    // If debug is true we compress the HTML and write it to the filesystem
    var file = path.join(appConfig.releaseDir, dir, fileName);
    appUtil.statusLog('Writing\t' + file);
    fs.writeFile(file, appConfig.isDebug ? out : kompressor(out, true), encoding='utf8');
}