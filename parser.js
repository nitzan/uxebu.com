//var md = require("markdown");
var fs = require('fs');
var md = require('markdown').markdown;
fs.readFile('home.md', 'utf-8', function (err, data) {
  if (err) throw err;
  var tree = md.toHTMLTree(data);
  var blocks = [];
  var str = '';
  var block = [];
  tree.splice(1).forEach(function(item, index){
  	if (item[0] == 'h1' && block.length){
		blocks.push(block);
		block = [];
	} else {
		block.push(item);
	}
  });

  console.log(blocks);
//  console.log(md.renderJsonML(['html', ['h1', 'fdsafdas']]));
});

