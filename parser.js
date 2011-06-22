var fs = require('fs');
var md = require('markdown').markdown;
var mustache = require('mustache');

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

