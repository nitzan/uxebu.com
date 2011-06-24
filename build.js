var fs = require('fs');
var md = require('markdown').markdown;
var mustache = require('mustache');
var blocks = require('./blocks/block');
var util   = require('util');
var exec  = require('child_process').exec;
var kompressor = require('htmlKompressor');

var debug = false;
var srcDir = './src'; // Template sources
var releaseDir = './release'; // Website release
var contentDir = './content'; // Markdown content

console.log('Welcome to the epic');
console.log('Debug mode\t\t\t' + debug);

// Simple mixin, note: it does not check for hasOwnProperty!
function mixin(target, obj){
    for (var prop in obj){
        target[prop] = obj[prop];
    }
}

// Reading src directory and passing found HTML file names to renderView()
fs.readdir(srcDir, function(err, data){
    clean();

    console.log('Reading HTML files from\t\t' + srcDir);
    data.forEach(function(item){
        if (item.indexOf('.html') > -1){
            renderView(item.split('.html')[0]);
        }
    });
});

function clean(){
    // Summary:
    //      1. Cleaning up release dir
    //      2. Copying media and static files to release dir
    console.log('Deleting\t\t\t' + releaseDir + '/*');
    exec('rm -rf ' + releaseDir + '/*', function(err, stdout, stderr){
        console.log('Copying\t\t\t\t' + srcDir + '/static to' + releaseDir + '/');
        console.log('Copying\t\t\t\t' + contentDir + '/media to ' + releaseDir + '/');
        exec('cp -r ' + srcDir + '/static ' + contentDir + '/media  ' + releaseDir + '/',
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
    fs.readFile(srcDir + '/' + name + '.html', 'utf-8', function(err, template){
        // 2.
        console.log('Reading and parsing \t\t' + srcDir + '/' + name + '.md');
        fs.readFile('content/' + name + '.md', 'utf-8', function(arr, markdown){
            // 3.
            var tree = parseMarkdown(markdown);
            var c = {};
            tree.forEach(function(block, index){
                // Based on the tree array we create mustach blocks with curstom callbacks
                // handling the mapping of Markdown elements to Mustach tags.
                c['block' + index] = function(){
                    return function(text, parse){
                        // 4.
                        // Looking uo mustache comment which specifies the box renderer
                        // we want to use.
                        var func = text.match(/[\s\S]*{{!(\w+)}}/)[1] || "simpleBox";
                        try {
                            var parsedBlock = blocks[func]([].concat(block)); // Make a copy of the block, since the method modifies it inside.
                            return mustache.to_html(text, parsedBlock);
                        }catch(e){
                            console.log('ERROR:\n\tSyntax error in "' + name + '.md", stopped parsing in block "' + block[0][1] +
                                        '".\n' + blocks[func].__docs__ + '\n');
                        }
                        return "";
                    }
                }
            });

            // 5.
            var out = mustache.to_html(template, c);

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
            console.log('Writing \t\t\trelease/' + name + '.html');
            fs.writeFile('release/' + name + '.html', debug ? out : kompressor(out, true), encoding='utf8');
        });
    });
}

function parseMarkdown(tree){
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
