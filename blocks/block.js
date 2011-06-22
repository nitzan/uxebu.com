var simpleBox = function(block){
	// Summary:
	// 		This is a simple textbox which renders a title, text
    // 		and an optional link at the bottom.
    //
    // Markdown:
    // 		Sample markup:
    //
	// 		Title						| Required
	// 		=====						|
	//									|
	// 		Some text.					| Required [+1, at least one]
	//									|
	// 		[Link](http://uxebu.com)	| Optional, if available as last item.
	//
	// Returns:
	// 		title:
	// 		content:
	//		link:

    var view = {};
    view.title = block.shift()[1]; // Remove the first element which is the title.
    if (block[block.length-1][0]=='a'){
        view.link = block.pop(); // Remove the last element if it is an a-href.
    }
    view.content = block.map(function(i){return md.renderJsonML(["html", i]);}).join(" ");
	return view;
};

exports.simpleBox = simpleBox;

var listBox = function(){

}
