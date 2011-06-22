var fs = require('fs');
var md = require('markdown').markdown;
var mustache = require('mustache');
var blocks = require('./blocks/blocks');

var srcDir = './src';
fs.readdir(srcDir, function(err, data){
	data.forEach(function(item){
		if (item.indexOf('.html') > -1){
			renderView(item.split('.html')[0]);
		}
	});
});

function mixin(target, obj){
	for (var prop in obj){
		target[prop] = obj[prop];
	}
}

function renderView(item){
	console.log(item);
	fs.readFile(srcDir + '/' + item + '.html', 'utf-8', function(err, template){
		fs.readFile('content/home.md', 'utf-8', function(arr, markdown){
			var tree = parseMarkdown(markdown);
			var c = {};
			tree.forEach(function(block, index){
				c['block' + index] = function(){
					return function(text, parse){
						return mustache.to_html(text, blocks.simpleTextBox(block));
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
			console.log(out);
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
/*
fs.readFile('home.md', 'utf-8', function (err, data) {
    if (err) throw err;
    var tree = md.toHTMLTree(data);
    console.log(tree);
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


    var b = blocks[0];
    var view = {
      title: b[0][1],
      content: b.slice(1).map(function(i){return md.renderJsonML(["html", i])}).join(" ")
//      link: md.renderJsonML(b[2])
    };
    var template ='<h1>{{title}}</h1><p>{{content}}</p>';
    var html = mustache.to_html(template, view);

    console.log(html.replace(/</g, "-").replace(/>/g, "-"));
});
*/
