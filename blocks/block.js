var simpleTextBox = function(block){
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

	var view = {
		title: block[0][1],
		content: block.slice(1).map(function(i){return md.renderJsonML(["html", i])}).join(" ")
	}

	return view;
};

exports.simpleBox = simpleTextBox;

var listBox = function(){

}
