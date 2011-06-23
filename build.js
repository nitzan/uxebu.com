var fs = require('fs');
var md = require('markdown').markdown;
var mustache = require('mustache');
var blocks = require('./blocks/block');
var util   = require('util');
var exec  = require('child_process').exec;

var srcDir = './src';

console.log('Welcome to the epic');

fs.readdir(srcDir, function(err, data){
	console.log('Reading HTML files to render');
	data.forEach(function(item){
		if (item.indexOf('.html') > -1){
			renderView(item.split('.html')[0]);
		}
	});
	moveFiles();
});

function moveFiles(){
	exec('rm -rf ./release/static', function(err, stdout, stderr){
		exec('cp -r ./src/static ./release/',
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

function mixin(target, obj){
	for (var prop in obj){
		target[prop] = obj[prop];
	}
}

function renderView(item){
	fs.readFile(srcDir + '/' + item + '.html', 'utf-8', function(err, template){
		console.log('Reading and parsing \t\t' + srcDir + '/' + item + '.md');
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
			console.log('Writing \t\t\trelease/' + item + '.html');
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
