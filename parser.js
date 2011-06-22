//var md = require("markdown");
var fs = require('fs');
var md = require('markdown').markdown;
fs.readFile('home.md', 'utf-8', function (err, data) {
  if (err) throw err;
  var tree = md.toHTMLTree(data);
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
  blocks.puhs(block);

  console.log(blocks);
//  console.log(md.renderJsonML(['html', ['h1', 'fdsafdas']]));
});

