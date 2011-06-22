var fs = require('fs');
var md = require('markdown').markdown;
var mustache = require('mustache');
var blocks = require('./blocks/block');
var util   = require('util');
var exec  = require('child_process').exec;

var srcDir = './src';
fs.readdir(srcDir, function(err, data){
	data.forEach(function(item){
		if (item.indexOf('.html') > -1){
			renderView(item.split('.html')[0]);
		}
	});
	exec('rm -rf ./release/img ./release/css', function(err, stdout, stderr){
		exec('cp -r ./src/img ./src/css ./release/',
			function (err, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (err !== null) {
					console.log('exec error: ' + error);
				}
			}
		);
	})
});

function mixin(target, obj){
	for (var prop in obj){
		target[prop] = obj[prop];
	}
}

function renderView(item){
	fs.readFile(srcDir + '/' + item + '.html', 'utf-8', function(err, template){
		fs.readFile('content/' + item + '.md', 'utf-8', function(arr, markdown){
			var tree = parseMarkdown(markdown);
			var c = {};
			tree.forEach(function(block, index){
				c['block' + index] = function(){
					return function(text, parse){
                        var func = text.match(/[\s\S]*{{!(\w+)}}/)[1] || "simpleBox";
						return mustache.to_html(text, blocks[func](block));
					}
				}
			});

			var out = mustache.to_html(template, c);
  			var voidTags = /area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/i;
  			out = out.replace(/<(\w+)([^<>]*)><\/\1>/g, function(_, tagName, attribs){
			    var markup = "<" + tagName + attribs;
			    markup += voidTags.test(tagName) ? " />" : "></" + tagName + ">";
			    return markup;
  			});
            fs.writeFile('release/' + item + '.html', out, encoding='utf8');
		});
	});
}

function parseMarkdown(tree){
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
