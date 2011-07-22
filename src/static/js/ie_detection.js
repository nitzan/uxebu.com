!function(){
	var v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');
	while (
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		all[0]
	);
	document.documentElement.className += v > 4 ? " ie" + v : ""; // modernized: thx to john-naked dalton :)
}();
